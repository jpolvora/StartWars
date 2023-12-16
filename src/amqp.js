import { ExecuteImport } from './application/useCases/ExecuteImport.js'

export default class Amqp {
  constructor(queue, httpClient, db) {
    this.queue = queue
    this.httpClient = httpClient
    this.db = db
  }

  async listen() {
    await this.queue.connect()

    this.queue.consume('jobScheduled', async (msg) => {
      const useCase = new ExecuteImport(this.queue, this.httpClient, this.db)
      await useCase.execute(msg)
    })

    this.queue.consume('importExecuted', async () => {
      console.log('importExecuted')
    })
  }

  async publish(event, data) {
    await this.queue.connect()
    await this.queue.publish(event, data)
  }
}
