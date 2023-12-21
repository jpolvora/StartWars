import { ExecuteImportUseCase } from '../application/useCases/ExecuteImportUseCase.js'
import { Events } from './Events.js'
import { adaptQueueMessageToUseCaseExecution } from './QueueUseCaseAdapter.js'
import { Services } from './Services.js'

export class AmqpServer {
  constructor(container) {
    this.queue = container.get(Services.queue)
    // this.httpClient = container.get(Services.httpClient)
    // this.personagens = container.get(Services.personagens)

    this.container = container
  }

  async listen() {
    await this.queue.connect()

    this.queue.consume(
      Events.importScheduled,
      adaptQueueMessageToUseCaseExecution(this.container, ExecuteImportUseCase),
    )

    this.queue.consume(Events.importFinished, async () => {
      console.log(Events.importFinished)
    })
  }

  async publish(event, data) {
    await this.queue.connect()
    await this.queue.publish(event, data)
  }

  async close() {
    await this.queue.disconnect()
    console.log('gracefully shutdown amqp connection')
  }
}
