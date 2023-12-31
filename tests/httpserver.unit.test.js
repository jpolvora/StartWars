import 'dotenv/config'
import { ExpressAdapter, HttpServer } from '../src/infra'
import { getContainer } from './mockedContainer.js'

describe('HttpServer instance Unit tests', () => {
  it('should assert injected constructor properties', () => {
    const container = getContainer()
    const app = new ExpressAdapter(container)
    const sut = new HttpServer(app, 3001)

    expect(sut.app).toBe(app)
    expect(sut.port).toBe(3001)
  })
})
