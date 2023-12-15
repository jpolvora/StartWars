import http from 'http'
import debug from 'debug'

const serverDebug = debug('server')
export default class Server {
  #shutDownFn
  #server

  constructor(api, port) {
    this.api = api
    this.port = port
  }

  listen() {
    return new Promise((resolve) => {
      const app = this.api.getExpressApp()
      const port = this.port
      const server = http.createServer(app)

      server.once('listening', () => {
        serverDebug('listening')
        return resolve(server)
      })

      this.#server = server

      return server.listen(port)
    })
  }

  /**
   * @param {(arg0: () => Promise<void>) => void} value
   */
  set shutDownFn(value) {
    this.#shutDownFn = value
  }

  async close() {
    await this.#shutDownFn()
  }
}
