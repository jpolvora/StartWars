import { sleep } from './sleep.js'
/**
 * Runs the function `fn`
 * and retries automatically if it fails.
 *
 * Tries max `1 + retries` times
 * with `retryIntervalMs` milliseconds between retries.
 *
 * From https://mtsknn.fi/blog/js-retry-on-fail/
 */
export const retry = async (fn, { retries, retryIntervalMs }) => {
  try {
    return await fn()
  } catch (error) {
    if (retries <= 0) {
      throw error
    }
    await sleep(retryIntervalMs)
    return retry(fn, { retries: retries - 1, retryIntervalMs })
  }
}
