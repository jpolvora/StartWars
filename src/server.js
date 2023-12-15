import http from 'http'
import debug from 'debug'

const serverDebug = debug('server')
export default class Server {
  #shutDownFn
  #httpServer

  constructor(api, port) {
    this.api = api
    this.port = port
  }

  listen() {
    return new Promise((resolve) => {
      const app = this.api.getExpressApp()
      const port = this.port
      const httpServer = http.createServer(app)
      this.#httpServer = httpServer

      httpServer.once('listening', () => {
        serverDebug('listening')
        return resolve(httpServer)
      })

      return httpServer.listen(port)
    })
  }

  /**
   * @param {(arg0: () => Promise<void>) => void} value
   */
  set shutDownFn(value) {
    this.#shutDownFn = value
  }

  get httpServer() {
    return this.#httpServer
  }

  async close() {
    await this.#shutDownFn()
  }
}
