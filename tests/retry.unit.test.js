import 'dotenv/config'
import { retry } from '../src/utils/retry.js'

const fn = () => 73

let error = false
const fnThrowOnce = () => {
  if (!error) {
    error = true
    throw new Error('exception will retry')
  }

  return fn()
}

const fnAlwaysThrow = async () => {
  await Promise.resolve()
  throw new Error('exception will retry')
}

describe('unit tests for Retry', () => {
  it('it should run fn and return 73', async () => {
    const a = await retry(() => fn(), {
      retries: 1,
      retryIntervalMs: 1,
    })

    expect(a).toBe(73)
  })

  it('it should retry once', async () => {
    const a = await retry(() => fnThrowOnce(), {
      retries: 1,
      retryIntervalMs: 1,
    })

    expect(a).toBe(73)
  })

  it('it should retry until fail', async () => {
    await expect(
      retry(() => fnAlwaysThrow(), {
        retries: 1,
        retryIntervalMs: 10,
      })
    ).rejects.toThrowError()
  })
})
