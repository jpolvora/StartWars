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

class Application {
  #container

  constructor() {
    const container = new Registry()
    this.#container = container

    container
      .set(Services.env, env)
      .set(Services.httpClient, new Axios({ baseURL: env.API_URL }))
      .set(Services.db, new MongoDbAdapter(env.MONGODB_URI, env.MONGODB_DBNAME))
      .set(Services.queue, new AmqpServer(new RabbitMQAdapter(env.AMQP_URL), container))
      .set(Services.server, new HttpServer(new ExpressAdapter(container), env.PORT))
      .build()
  }

  async run() {
    try {
      const retryOptions = { retries: 9, retryIntervalMs: 1000 }

      const serverPromise = retry(() => this.#container.get(Services.server).listen(), retryOptions)
      const amqpPromise = retry(() => this.#container.get(Services.queue).listen(), retryOptions)
      const mongoDbPromise = retry(() => this.#container.get(Services.db).connect(), retryOptions)

      //await all promises in parallel
      const promises = await Promise.all([serverPromise, amqpPromise, mongoDbPromise])

      console.log('all services connected successfully')

      configureGracefulShutdown(promises[0], env.NODE_ENV, this.onShutdown.bind(this))
    } catch (e) {
      throw new Error('error on trying to run Application: ', e)
    }
  }

  async onShutdown(signal) {
    console.info('app async shutdow via signal: ', signal)
    await this.#container.get(Services.db).disconnect()
    await this.#container.get(Services.queue).close()
    await this.#container.get(Services.server).httpServer.close()
  }
}

new Application().run().catch(console.error.bind(console))
