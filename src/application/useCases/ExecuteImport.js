import { PeopleCollection } from '../../infra/PeopleCollection.js'

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
    try {
      const endpoint = msg.next || 'people'
      const response = await this.httpClient.get(endpoint)
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

      var gw = new PeopleCollection(this.db)
      await gw.write(people)

      //save data in repository

      if (data.next) {
        //schedule next job
        await this.queue.publish('jobScheduled', {
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
