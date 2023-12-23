import 'dotenv/config.js'
import cluster from 'node:cluster'
import { env } from './config/env.js'
import { Axios } from 'axios'
import { Application } from './Application.js'
import {
  AmqpServer,
  ExpressAdapter,
  HttpServer,
  MongoDbAdapter,
  RabbitMQAdapter,
  Registry,
  Services,
  ConsoleLogger,
} from './infra/index.js'

const workerCount = env.WORKERS
const autoRestart = env.AUTORESTART
const isPrimary = workerCount > 1 && cluster.isPrimary
const isWorker = !cluster.isPrimary || workerCount < 2

if (isPrimary) {
  console.log(`Primary process ${process.pid} is running`)

  const workers = []

  for (let i = 0; i < workerCount; i++) {
    const worker = cluster.fork()
    workers.push(worker)
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker process ${worker.process.pid} died. Restarting...`)
    if (autoRestart) cluster.fork()
  })
}

if (isWorker) {
  console.log(`Worker process ${cluster.worker?.id || process.pid} is running`)
  const container = new Registry()
  container
    .set(Services.env, env)
    .set(Services.httpClient, new Axios({ baseURL: env.API_URL }))
    .set(Services.db, new MongoDbAdapter(env.MONGODB_URI, env.MONGODB_DBNAME))
    .set(Services.queue, new AmqpServer(new RabbitMQAdapter(env.AMQP_URL), container))
    .set(Services.server, new HttpServer(new ExpressAdapter(container), env.PORT))
    .set(Services.logger, new ConsoleLogger())
    .build()

  new Application(container).run().catch(console.error.bind(console))
}
