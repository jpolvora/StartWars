import { Registry } from '../src/infra/Registry.js'
import { Services } from '../src/infra/Services.js'
import { env } from '../src/config/env.js'
import { sleep } from '../src/utils/index.js'

export function getContainer(mergeVars) {
  const container = Registry.instance
  const valuesToMerge = mergeVars || {}
  container.set(Services.env, {
    ...env,
    ...valuesToMerge,
  })

  container.set(Services.amqp, {
    connect: () => {},
    publish: () => {},
    consume: () => {},
  })

  container.set(Services.personagens, {
    getById: async (id) => {
      if (id === 99) {
        return undefined
      }

      await sleep(100)
      return {
        id,
        nome: 'fake' + id,
        altura: 100,
        peso: 100,
      }
    },

    getAll: async () => {
      await sleep(100)
      return [
        {
          id: 1,
          nome: 'fake 1',
          altura: 100,
          peso: 100,
        },
        {
          id: 2,
          nome: 'fake 2',
          altura: 90,
          peso: 110,
        },
      ]
    },
  })

  return container.build()
}
