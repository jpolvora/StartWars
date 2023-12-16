import { Events } from '../../infra/Events.js'
import { PersonagensCollection } from '../repository/PersonagensCollection.js'

/**
 * Executes a scheduled import Job
 */

export class ExecuteImport {
  constructor(queue, httpClient, db) {
    this.queue = queue
    this.httpClient = httpClient
    this.db = db
  }

  async execute(msg) {
    if (!msg || !msg.next) return

    console.log(`executing import: ${msg.next}`)
    try {
      const response = await this.httpClient.get(msg.next)
      const data = JSON.parse(response.data)

      //console.log(data)

      const people = []
      for (const result of data.results) {
        const person = {
          updateOne: {
            filter: { _id: result.url },
            upsert: true,
            update: {
              $set: {
                _id: result.url,
                nome: result.name,
                altura: result.height,
                genero: result.gender,
              },
            },
          },
        }

        people.push(person)
      }

      var gw = new PersonagensCollection(this.db)
      await gw.write(people)

      //save data in repository

      if (data.next) {
        //schedule next job
        await this.queue.publish(Events.importScheduled, {
          uuid: msg.uuid,
          next: data.next,
        })
      } else {
        await this.queue.publish('importExecuted', {
          uuid: msg.uuid,
        })
      }
    } catch (e) {
      console.error(e)
    }

    return true
  }
}
