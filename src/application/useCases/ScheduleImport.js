/**
 * Schedules an import Job by sending a message to the broker/queue
 */
export class ScheduleImport {
  constructor(queue) {
    this.queue = queue
  }

  async execute(input) {
    const event = {
      uuid: input,
      next: false,
    }

    await this.queue.publish('jobScheduled', event)

    return event
  }
}
