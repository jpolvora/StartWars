import 'dotenv/config'
import { ExpressAdapter, HttpServer, Registry } from '../src/infra'
import { getContainer } from './mockedContainer.js'

describe('HttpServer instance Integration tests', () => {
  it('should setup httpServer', async () => {
    const app = new ExpressAdapter(getContainer())
    const sut = new HttpServer(app, 3001)
    await sut.listen()
    expect(sut.app).toBe(app)
    expect(sut.port).toBe(3001)
    sut.httpServer.close()
  })

  it('should throw error httpServer when listening on same port', async () => {
    const app = new ExpressAdapter(getContainer())
    const a = new HttpServer(app, 3001)
    const b = new HttpServer(app, 3001)
    await expect(Promise.all([a.listen(), b.listen()])).rejects.toThrowError()
  })
})
