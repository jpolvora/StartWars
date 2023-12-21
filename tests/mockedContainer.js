import { Registry } from '../src/infra/Registry.js'
import { Services } from '../src/infra/Services.js'
import { env } from '../src/config/env.js'
import { sleep } from '../src/utils/index.js'
import { MockPersonagens } from './MockPersonagens.js'

export function getContainer(mergeVars) {
  const container = new Registry()
  const valuesToMerge = mergeVars || {}
  container.set(Services.env, {
    ...env,
    ...valuesToMerge,
  })

  container.set(Services.queue, {
    publish: async (queueName, data) => {
      await sleep(1000)
    },
  })

  container.set(Services.httpClient, {
    get: async (url) => {
      await sleep(1000)
      return {
        data: JSON.stringify({
          results: [
            {
              url: '/people/1',
              name: 'john doe',
              height: 180,
              gender: 'male',
            },
          ],
        }),
      }
    },
    post: async (url, data) => {
      await sleep(1000)
      return true
    },
  })

  container.set(Services.amqp, {
    connect: () => {},
    publish: () => {},
    consume: () => {},
  })

  container.set(Services.db, {
    getPersonagens: () => new MockPersonagens(),
  })

  return container.build()
}
