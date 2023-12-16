import 'dotenv/config.js'
import { env } from './env.js'
import Api from './api.js'
import Server from './server.js'
import RabbitMQAdapter from './infra/RabbitMQAdapter.js'
import { configureGracefulShutdown } from './graceful.js'
import Amqp from './amqp.js'

async function start() {
  const queue = new RabbitMQAdapter(env.AMQP_URL)
  const amqp = new Amqp(queue)

  const api = new Api({
    amqp,
  })
  const app = api.initialize()
  const server = new Server(app, env.PORT)

  try {
    await Promise.all[(server.listen(), amqp.listen())]

    server.shutDownFn = configureGracefulShutdown(
      server.httpServer,
      env.NODE_ENV
    )

    console.log(
      `server listening on port ${env.PORT} in ${env.NODE_ENV} environment`
    )
  } catch (e) {
    throw new Error(`error on trying to run Server: ${e}`)
  }
}

start().catch(console.error.bind(console))
