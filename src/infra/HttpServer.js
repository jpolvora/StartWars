import http from 'http'
import debug from 'debug'

const serverDebug = debug('server')
export class HttpServer {
  #httpServer = null
  #listening = false
  #app = null
  port = 3000

  constructor(app, port) {
    this.#app = app
    this.port = port
  }

  listen() {
    return new Promise((resolve, reject) => {
      return this.#app.initialize().then((app) => {
        if (this.#listening) return resolve(this.#httpServer)
        this.#listening = true
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
      })
    })
  }

  get httpServer() {
    return this.#httpServer
  }

  get app() {
    return this.#app
  }
}
