import { ExecuteImport } from './application/useCases/ExecuteImport.js'

export default class Amqp {
  constructor(queue) {
    this.queue = queue
  }

  async listen() {
    await this.queue.connect()
    this.queue.consume('jobScheduled', async (msg) => {
      const useCase = new ExecuteImport(this.queue)
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
