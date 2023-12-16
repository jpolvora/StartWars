import 'dotenv/config'
import { env } from '../src/config/env.js'
import { agent as request } from 'supertest'
import { ExpressAdapter } from '../src/infra/ExpressAdapter'
import { randomUUID } from 'crypto'

let expressApp

beforeEach(async () => {
  const container = {
    amqp: {
      connect: () => {},
      publish: () => {},
      consume: () => {},
    },
    env,
  }

  const api = new ExpressAdapter(container)
  expressApp = api.initialize()
})

afterEach(() => {})

afterAll(async () => {})

describe('unit tests for ENDPOINTS', () => {
  it('it should receive statusCode 200 on GET /api', async () => {
    const sut = expressApp
    const response = await request(sut).get('/api')
    expect(response.statusCode).toBe(200)
  })

  it('it should receive statusCode 200 and valid uuid on GET /api', async () => {
    const sut = expressApp
    const response = await request(sut).get('/api/import')

    expect(response.statusCode).toBe(200)
    expect(response.body.uuid).toBeTruthy()
  })

  it('it should schedule an import job', async () => {
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

  it('it should not schedule a job on missing uuid', async () => {
    const sut = expressApp
    const response = await request(sut).post('/api/import')

    expect(response.statusCode).toBe(400)
  })

  it('it should list personagens', async () => {
    const sut = expressApp
    const response = await request(sut).get('/api/personagens')

    expect(response.statusCode).toBe(200)
    expect(response.body.data).toBeTruthy()
  })

  it('it should get info about personagem id 1', async () => {
    const sut = expressApp
    const response = await request(sut).get('/api/personagens/1')

    expect(response.statusCode).toBe(200)
    expect(response.body.data).toBeTruthy()
    expect(response.body.data.id).toBe(1)
  })

  it('it should get info about personagem id 2', async () => {
    const sut = expressApp
    const response = await request(sut).get('/api/personagens/2')

    expect(response.statusCode).toBe(200)
    expect(response.body.data).toBeTruthy()
    expect(response.body.data.id).toBe(2)
  })

  it('it should return 404 on invalid personagem id', async () => {
    const sut = expressApp
    const response = await request(sut).get('/api/personagens/undefined')

    expect(response.statusCode).toBe(404)
  })

  it('it should return 404 on invalid api endpoint', async () => {
    const sut = expressApp
    const response = await request(sut).get('/api/invalid')

    expect(response.statusCode).toBe(404)
  })
})
