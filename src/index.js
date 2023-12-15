import { env } from './env.js'
import Api from './api.js'
import Server from './server.js'
import GracefulShutdown from 'http-graceful-shutdown'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

async function shutdownFunction() {
  console.log('closing databse connections')
}

function finalFunction() {
  console.log('final function shutdown')
}

async function start() {
  const api = new Api()
  const routesPath = join(__dirname, './routes')
  await api.configure(routesPath)

  const server = new Server(api, env.PORT)
  try {
    const httpServer = await server.listen()

    GracefulShutdown(httpServer, {
      forceExit: false, // triggers process.exit() at the end of shutdown process
      onShutdown: shutdownFunction, // shutdown function (async) - e.g. for cleanup DB, ...
      finally: finalFunction, // finally function (sync) - e.g. for logging
    })

    console.log(
      `server listening on port ${env.PORT} in ${env.NODE_ENV} environment`
    )
  } catch (error) {
    throw new Error(`error on trying to run Server:${error}`)
  }
}

start().catch(console.error.bind(console))
