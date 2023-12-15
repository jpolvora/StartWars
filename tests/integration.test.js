import { agent as request } from 'supertest'
import { join, dirname } from 'path'
import Api from '../src/api.js'
import { fileURLToPath } from 'url'

let api

beforeEach(async () => {
  const currentPath = dirname(fileURLToPath(import.meta.url))
  const routesPath = join(currentPath, '../src/routes')
  api = new Api()
  await api.configure(routesPath)
})

afterEach(() => {})

test('it should be done', async () => {
  const sut = api.getExpressApp()
  const response = await request(sut).get('/')
  expect(response.statusCode).toBe(200)
})

test('it should be done 2', async () => {
  const sut = api.getExpressApp()
  const response = await request(sut).get('/scripts')
  expect(response.statusCode).toBe(200)
})

test('it should not be done', async () => {
  const sut = api.getExpressApp()
  const response = await request(sut).get('/more')
  expect(response.statusCode).toBe(404)
})
