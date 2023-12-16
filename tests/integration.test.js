import { agent as request } from 'supertest'
import { join, dirname } from 'path'
import Api from '../src/api.js'
import { fileURLToPath } from 'url'
import { randomUUID } from 'crypto'

let expressApp

beforeEach(async () => {
  const currentPath = dirname(fileURLToPath(import.meta.url))
  const routesPath = join(currentPath, '../src/routes')
  const api = new Api()
  expressApp = api.initialize(routesPath)
})

afterEach(() => {})

afterAll(async () => {})

describe('unit tests for ENDPOINTS', () => {
  it('it should be done', async () => {
    const sut = expressApp
    const response = await request(sut).get('/api')
    expect(response.statusCode).toBe(200)
  })

  it('it should be done 2', async () => {
    const sut = expressApp
    const response = await request(sut).get('/api/import')
    expect(response.statusCode).toBe(200)
  })

  it('it should be done 3', async () => {
    const sut = expressApp

    const payload = {
      uuid: randomUUID(),
    }

    const response = await request(sut)
      .post('/api/import')
      .send({
        ...payload,
      })

    expect(response.statusCode).toBe(201)
  })

  it('it should be done 3', async () => {
    const sut = expressApp
    const response = await request(sut).post('/api/import')

    expect(response.statusCode).toBe(400)
  })

  it('it should not be done', async () => {
    const sut = expressApp
    const response = await request(sut).get('/api/invalid')

    expect(response.statusCode).toBe(404)
  })
})
