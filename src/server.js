export default class Server {
  constructor(api, port) {
    this.api = api
    this.port = port
  }

  listen() {
    return new Promise((resolve) => {
      let server
      server = this.api.getExpressApp().listen(this.port, () => {
        console.log(`server "${server}" running at port ${this.port}`)
        return resolve(server)
      })
    })
  }
}
