import { Events } from '../../infra/Events.js'
import { Services } from '../../infra/Services.js'

/**
 * Executes a scheduled import Job
 */

export class ExecuteImportUseCase {
  constructor(container) {
    this.queue = container.get(Services.queue)
    this.httpClient = container.get(Services.httpClient)
    this.personagens = container.get(Services.personagens)
  }

  async execute(msg) {
    if (!msg || !msg.next) return

    function getIdFromUrl(url) {
      const parts = url.split('/')
      const lastSegment = parts.pop() || parts.pop() // handle potential trailing slash
      return lastSegment
    }

    function toDto(item) {
      const id = getIdFromUrl(item.url)
      const person = {
        id: Number(id),
        nome: item.name,
        altura: item.height,
        genero: item.gender,
      }

      return person
    }

    console.log('executing import: %o', msg)
    try {
      const response = await this.httpClient.get(msg.next)
      const data = JSON.parse(response.data)
      const people = data.results.map(toDto)

      //save data in personagens collection gateway
      await this.personagens.saveAllAsync(people)

      if (data.next) {
        //schedule next job continuation
        await this.queue.publish(Events.importScheduled, {
          uuid: msg.uuid,
          next: data.next,
        })
      } else {
        await this.queue.publish(Events.importFinished, {
          uuid: msg.uuid,
        })
      }
    } catch (e) {
      console.error(e)
    }

    return true
  }
}
