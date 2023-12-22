import { ExecuteImportUseCase } from '../application/useCases/ExecuteImportUseCase.js'
import { ImportFinishedUseCase } from '../application/useCases/ImportFinishedUseCase.js'
import { Events } from './Events.js'
import { adaptMessageToUseCase } from './adaptMessageToUseCase.js'

export class AmqpServer {
  #isConnected = false

  constructor(client, container) {
    this.client = client
    this.container = container
  }

  //template method
  getEventUseCaseMap() {
    return [
      {
        event: Events.importScheduled,
        useCase: ExecuteImportUseCase,
      },
      {
        event: Events.importFinished,
        useCase: ImportFinishedUseCase,
      },
    ]
  }

  async listen() {
    if (this.#isConnected) return
    await this.client.connect()
    this.#isConnected = true
    const eventMap = this.getEventUseCaseMap()
    this.subscribeAll(eventMap)
  }

  async subscribeAll(consumers) {
    for (const consumer of consumers) {
      this.client.consume(consumer.event, adaptMessageToUseCase(this.container, consumer.useCase))
    }
  }

  async publish(event, data) {
    if (!this.#isConnected) throw new Error('not connected')

    try {
      await this.client.publish(event, data)
    } catch (e) {
      console.error('Error trying to publish message to queue: %o ', e)
      throw e
    }
  }

  async close() {
    try {
      await this.client.disconnect()
      console.log('gracefully shutdown amqp connection')
    } catch (e) {
      console.error('Error while disconnecting from amqp server: '.e)
    }
  }
}
