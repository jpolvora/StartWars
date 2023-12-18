import http from 'http'
import debug from 'debug'

const serverDebug = debug('server')
export class HttpServer {
  #shutDownFn
  #httpServer

  constructor(app, port) {
    this.app = app
    this.port = port
  }

  listen() {
    return new Promise(async (resolve, reject) => {
      try {
        const app = await this.app.initialize()
        const httpServer = http.createServer(app)
        this.#httpServer = httpServer

        httpServer.once('listening', () => {
          serverDebug('listening')
          console.log(
            `server listening on port ${this.port} in ${process.env.NODE_ENV} environment`
          )
          return resolve(httpServer)
        })

        httpServer.once('error', (e) => {
          serverDebug('error: %o', e)
          return reject(e)
        })

        return httpServer.listen(this.port)
      } catch (e) {
        console.error('Erro ao tentar iniciar o servidor http: ' + e)
        throw e
      }
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
