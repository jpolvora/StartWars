import { ExecuteImport } from '../application/useCases/ExecuteImport.js'
import { Events } from './Events.js'

export class AmqpServer {
  constructor(queue, httpClient, db) {
    this.queue = queue
    this.httpClient = httpClient
    this.db = db
  }

  async listen() {
    await this.queue.connect()

    this.queue.consume(Events.importScheduled, async (msg) => {
      const useCase = new ExecuteImport(this.queue, this.httpClient, this.db)
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
