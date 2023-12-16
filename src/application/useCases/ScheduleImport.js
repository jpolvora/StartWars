import { Events } from '../../infra/Events.js'

/**
 * Schedules an import Job by sending a message to the broker/queue
 */
export class ScheduleImport {
  constructor(queue, initialUrl) {
    this.queue = queue
    this.initialUrl = initialUrl
  }

  async execute(input) {
    const event = {
      uuid: input,
      next: this.initialUrl,
    }

    await this.queue.publish(Events.importScheduled, event)

    return event
  }
}
