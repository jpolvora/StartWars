import http from 'http'
import debug from 'debug'

const serverDebug = debug('server')
export default class Server {
  #shutDownFn
  #httpServer

  constructor(app, port) {
    this.app = app
    this.port = port
  }

  listen() {
    return new Promise((resolve, reject) => {
      const httpServer = http.createServer(this.app)
      this.#httpServer = httpServer

      httpServer.once('listening', () => {
        serverDebug('listening')
        return resolve(httpServer)
      })

      httpServer.once('error', (e) => {
        serverDebug('error: %o', e)
        return reject(e)
      })

      return httpServer.listen(this.port)
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
