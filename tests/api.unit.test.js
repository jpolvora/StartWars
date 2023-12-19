import 'dotenv/config'
import { env } from '../src/config/env.js'
import { ExpressAdapter } from '../src/infra/ExpressAdapter'
import { getContainer } from './mockedContainer.js'

describe('unit tests for ExpressAdapter Class', () => {
  it('calling configure twice returns same instance (in test mode)', async () => {
    const api = new ExpressAdapter(
      getContainer({
        NODE_ENV: 'test',
      })
    )
    const a = await api.initialize()
    const b = await api.initialize()
    const c = await api.initialize()

    expect(a).toBe(b)
    expect(b).toBe(c)
    expect(c).toBe(a)
  })

  it('calling configure twice returns same instance (in non testing mode)', async () => {
    const api = new ExpressAdapter(
      getContainer({
        NODE_ENV: 'development',
      })
    )
    const a = await api.initialize()
    const b = await api.initialize()
    const c = await api.initialize()

    expect(a).toBe(b)
    expect(b).toBe(c)
    expect(c).toBe(a)
  })

  it('it should enable swagger', async () => {
    const api = new ExpressAdapter(
      getContainer({
        NODE_ENV: 'development',
        ENABLE_SWAGGER: true,
      })
    )
    const a = await api.initialize()
    const b = await api.initialize()

    expect(a).toBe(b)
  })

  it('it should disable swagger', async () => {
    const api = new ExpressAdapter(
      getContainer({
        NODE_ENV: 'development',
        ENABLE_SWAGGER: false,
      })
    )
    const a = await api.initialize()
    const b = await api.initialize()

    expect(a).toBe(b)
  })
})
