import Api from '../src/api.js'

describe('unit tests for Api Class', () => {
  it('calling configure twice returns same instance', async () => {
    const sut = new Api()
    const a = sut.initialize()
    const b = sut.initialize()

    expect(a).toBe(b)
  })
})
