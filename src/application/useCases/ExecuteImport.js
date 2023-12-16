import { randomUUID } from 'crypto'

/**
 * Executes a scheduled import Job
 */

export class ExecuteImport {
  constructor(queue) {
    this.queue = queue
  }

  async execute() {
    const event = {
      uuid: randomUUID(),
    }

    await this.queue.publish('importExecuted', event)

    return event
  }
}
