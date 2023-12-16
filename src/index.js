import 'dotenv/config.js'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { env } from './env.js'
import Api from './api.js'
import Server from './server.js'
import { configureGracefulShutdown } from './graceful.js'

async function start() {
  const currentPath = dirname(fileURLToPath(import.meta.url))
  const routesPath = join(currentPath, './routes')
  const api = new Api()
  const app = api.initialize(routesPath)
  const server = new Server(app, env.PORT)
  try {
    await server.listen()

    server.shutDownFn = configureGracefulShutdown(
      server.httpServer,
      env.NODE_ENV
    )

    console.log(
      `server listening on port ${env.PORT} in ${env.NODE_ENV} environment`
    )
  } catch (error) {
    throw new Error(`error on trying to run Server:${error}`)
  }
}

start().catch(console.error.bind(console))
