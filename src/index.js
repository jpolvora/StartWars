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
  await api.configure(routesPath)
  const server = new Server(api, env.PORT)
  try {
    const httpServer = await server.listen()

    server.shutDownFn = configureGracefulShutdown(httpServer, env.NODE_ENV)

    console.log(
      `server listening on port ${env.PORT} in ${env.NODE_ENV} environment`
    )
  } catch (error) {
    throw new Error(`error on trying to run Server:${error}`)
    // } finally {
    //   setTimeout(async () => {
    //     await shutdown()
    //   }, 30000)
  }
}

start().catch(console.error.bind(console))
