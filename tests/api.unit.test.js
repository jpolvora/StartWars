import 'dotenv/config'
import { env } from '../src/config/env.js'
import { ExpressAdapter } from '../src/infra/ExpressAdapter'
import { Registry } from '../src/infra/Registry.js'
import { Services } from '../src/infra/Services.js'

describe('unit tests for ExpressAdapter Class', () => {
  it('calling configure twice returns same instance', async () => {
    const container = Registry.instance
    container.set(Services.env, env)

    container.set(Services.amqp, {
      connect: () => {},
      publish: () => {},
      consume: () => {},
    })

    container.set(Services.personagens, {
      getById: async (id) => {
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

    const api = new ExpressAdapter(container)
    const a = await api.initialize()
    const b = await api.initialize()
    const c = await api.initialize()

    expect(a).toBe(b)
    expect(b).toBe(c)
    expect(c).toBe(a)
  })
})
