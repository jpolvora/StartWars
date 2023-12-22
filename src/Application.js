import { env } from './config/env.js'
import { configureGracefulShutdown, Services } from './infra/index.js'
import { retry } from './utils/index.js'

export class Application {
  #container

  constructor(container) {
    this.#container = container
  }

  run = async () => {
    try {
      const retryOptions = { retries: 9, retryIntervalMs: 1000 }

      const server = this.#container.get(Services.server)
      const serverPromise = retry(() => server.listen(), retryOptions)
      const amqpPromise = retry(() => this.#container.get(Services.queue).listen(), retryOptions)
      const mongoDbPromise = retry(() => this.#container.get(Services.db).connect(), retryOptions)

      //await all promises in parallel
      await Promise.all([serverPromise, amqpPromise, mongoDbPromise])

      console.log('all services connected successfully')

      configureGracefulShutdown(server.httpServer, env.NODE_ENV, this.onShutdown)
    } catch (e) {
      throw new Error(`error on trying to run Application: ${e}`)
    }
  }

  onShutdown = async (signal) => {
    console.info('app async shutdow via signal: ', signal)
    await this.#container.get(Services.db).disconnect()
    await this.#container.get(Services.queue).close()
    await this.#container.get(Services.server).httpServer.close()
  }
}
