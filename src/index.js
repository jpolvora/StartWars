import 'dotenv/config.js'
import { env } from './env.js'
import Api from './api.js'
import Server from './server.js'

async function start() {
  const api = new Api()
  const server = new Server(api, env.PORT)
  try {
    await server.listen()
  } catch (error) {
    throw new Error('error on trying to run Server:' + error)
  }
}

start().catch(console.error.bind(console))
