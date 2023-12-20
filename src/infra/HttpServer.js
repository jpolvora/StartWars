import http from 'http'
import debug from 'debug'

const serverDebug = debug('server')
export class HttpServer {
  #httpServer
  #listening = false

  constructor(app, port) {
    this.app = app
    this.port = port
  }

  listen() {
    return new Promise(async (resolve, reject) => {
      if (this.#listening) return resolve(this.httpServer)
      this.#listening = true
      try {
        const app = await this.app.initialize()
        const httpServer = http.createServer(app)
        this.#httpServer = httpServer

        httpServer.once('listening', () => {
          const listenMessage = `server listening on port ${this.port} in ${process.env.NODE_ENV} environment`
          serverDebug(listenMessage)
          console.log(listenMessage)
          return resolve(httpServer)
        })

        httpServer.once('error', (e) => {
          serverDebug('error: %o', e)
          this.#listening = false
          return reject(e)
        })

        return httpServer.listen(this.port)
      } catch (e) {
        serverDebug('Erro ao tentar iniciar o servidor http: ' + e)
        throw e
      }
    })
  }

  get httpServer() {
    return this.#httpServer
  }
}
