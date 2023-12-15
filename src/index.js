import Api from "./api.js"
import Server from "./server.js"

async function start() {
  const api = new Api()
  const port = process.env.PORT || 3000
  const server = new Server(api, Number(port))
  try {
    const httpServer = await server.listen()
    httpServer.on("connection", function () {
      console.log("someone is connected")
    })
    console.log("server listening")
  } catch (error) {
    throw new Error("error on trying to run Server:" + error)
  }
}

start().catch(console.error.bind(console))
