import { ExecuteImportUseCase } from '../application/useCases/ExecuteImportUseCase.js'
import { ImportFinishedUseCase } from '../application/useCases/ImportFinishedUseCase.js'
import { Events } from './Events.js'
import { adaptQueueMessageToUseCaseExecution } from './QueueUseCaseAdapter.js'
import { Services } from './Services.js'

export class AmqpServer {
  constructor(client, container) {
    this.client = client
    this.container = container
  }

  async listen() {
    await this.client.connect()

    this.subscribe([
      {
        event: Events.importScheduled,
        useCase: ExecuteImportUseCase,
      },
      {
        event: Events.importFinished,
        useCase: ImportFinishedUseCase,
      },
    ])
  }

  async subscribe(consumers) {
    for (const consumer of consumers) {
      this.client.consume(
        consumer.event,
        adaptQueueMessageToUseCaseExecution(this.container, consumer.useCase),
      )
    }
  }

  async publish(event, data) {
    await this.client.connect()
    await this.client.publish(event, data)
  }

  async close() {
    await this.client.disconnect()
    console.log('gracefully shutdown amqp connection')
  }
}
