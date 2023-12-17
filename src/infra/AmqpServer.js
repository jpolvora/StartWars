import { ExecuteImportUseCase } from '../application/useCases/ExecuteImportUseCase.js'
import { Events } from './Events.js'
import { Services } from './Services.js'

export class AmqpServer {
  constructor(container) {
    this.queue = container.get(Services.queue)
    this.httpClient = container.get(Services.httpClient)
    this.personagens = container.get(Services.personagens)
  }

  async listen() {
    await this.queue.connect()

    this.queue.consume(Events.importScheduled, async (msg) => {
      const useCase = new ExecuteImportUseCase(
        this.queue,
        this.httpClient,
        this.personagens
      )
      await useCase.execute(msg)
    })

    this.queue.consume(Events.importFinished, async () => {
      console.log(Events.importFinished)
    })
  }

  async publish(event, data) {
    await this.queue.connect()
    await this.queue.publish(event, data)
  }

  async close() {
    await this.queue.close()
  }
}
