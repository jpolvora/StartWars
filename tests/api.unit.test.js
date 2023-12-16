import { agent as request } from 'supertest'
import { join, dirname } from 'path'
import Api from '../src/api.js'
import { fileURLToPath } from 'url'
import { randomUUID } from 'crypto'

describe('unit tests for Api Class', () => {
  it('calling configure twice returns same instance', async () => {
    const sut = new Api()
    const a = sut.initialize()
    const b = sut.initialize()

    expect(a).toBe(b)
  })
})
