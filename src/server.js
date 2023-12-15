import http from 'http'
import debug from 'debug'

const serverDebug = debug('server')
export default class Server {
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

      return server.listen(port)
    })
  }
}
