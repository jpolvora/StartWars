import { Events } from '../../infra/Events.js'
import { Services } from '../../infra/Services.js'

/**
 * Schedules an import Job by sending a message to the broker/queue
 */
export class ScheduleImportUseCase {
  constructor(container) {
    this.queue = container.get(Services.amqp)
    const env = container.get(Services.env)
    const initialUrl = `${env.API_URL}/people`
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
