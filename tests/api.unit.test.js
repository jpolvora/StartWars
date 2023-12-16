import 'dotenv/config'
import { env } from '../src/config/env.js'
import { ExpressAdapter } from '../src/infra/ExpressAdapter'

describe('unit tests for ExpressAdapter Class', () => {
  it('calling configure twice returns same instance', async () => {
    const container = {
      amqp: {
        connect: () => {},
        publish: () => {},
        consume: () => {},
      },
      env,
    }

    const api = new ExpressAdapter(container)
    const a = api.initialize()
    const b = api.initialize()
    const c = api.initialize()

    expect(a).toBe(b)
    expect(b).toBe(c)
    expect(c).toBe(a)
  })
})
