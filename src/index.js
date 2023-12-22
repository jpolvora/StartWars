import 'dotenv/config.js'
import cluster from 'node:cluster'
import { env } from './config/env.js'
import { Axios } from 'axios'
import {
  AmqpServer,
  ExpressAdapter,
  HttpServer,
  MongoDbAdapter,
  RabbitMQAdapter,
  Registry,
  Services,
} from './infra/index.js'
import { ConsoleLogger } from './infra/ConsoleLogger.js'
import { Application } from './Application.js'

const workerCount = env.WORKERS || 2
const autoRestart = env.AUTORESTART

if (workerCount > 1 && cluster.isPrimary) {
  console.log(`Primary process ${process.pid} is running`)

  for (let i = 0; i < workerCount; i++) {
    cluster.fork()
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker process ${worker.process.pid} died. Restarting...`)
    if (autoRestart) cluster.fork()
  })
} else {
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
