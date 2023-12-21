import 'dotenv/config.js'
import { env } from './config/env.js'
import { Axios } from 'axios'
import {
  AmqpServer,
  ExpressAdapter,
  HttpServer,
  configureGracefulShutdown,
  MongoDbAdapter,
  RabbitMQAdapter,
  Registry,
  Services,
} from './infra/index.js'
import { retry } from './utils/index.js'

async function start() {
  try {
    const container = new Registry()
    container
      .set(Services.env, env)
      .set(Services.httpClient, new Axios({ baseURL: env.API_URL }))
      .set(Services.db, new MongoDbAdapter(env.MONGODB_URI, env.MONGODB_DBNAME))
      .set(Services.queue, new AmqpServer(new RabbitMQAdapter(env.AMQP_URL), container))
      .build()

    const server = new HttpServer(new ExpressAdapter(container), env.PORT)

    const retryOptions = { retries: 9, retryIntervalMs: 1000 }

    const amqpPromise = retry(() => container.get(Services.queue).listen(), retryOptions)
    const mongoDbPromise = retry(() => container.get(Services.db).connect(), retryOptions)
    const serverPromise = retry(() => server.listen(), retryOptions)

    //await all promises in parallel
    await Promise.all([serverPromise, amqpPromise, mongoDbPromise])

    console.log('all services connected successfully')

    return configureGracefulShutdown(server.httpServer, env.NODE_ENV, async (_signal) => {
      await container.get(Services.db).disconnect()
      await container.get(Services.queue).close()
      await server.httpServer.close()
    })
  } catch (e) {
    throw new Error('error on trying to run Application: ', e)
  }
}

start().catch(console.error.bind(console))
