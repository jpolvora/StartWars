import 'dotenv/config.js'
import { env } from './env.js'
import Api from './api.js'
import Server from './server.js'
import RabbitMQAdapter from './infra/RabbitMQAdapter.js'
import Amqp from './amqp.js'
import { configureGracefulShutdown } from './graceful.js'
import { Axios } from 'axios'
import MongoDbConnection from './infra/MongoDbConnection.js'

async function start() {
  const httpClient = new Axios({
    baseURL: 'https://swapi.dev/api',
  })

  const mongoDbConnection = new MongoDbConnection(env.MONGODB_URI)

  const queue = new RabbitMQAdapter(env.AMQP_URL)
  const amqp = new Amqp(queue, httpClient, mongoDbConnection.getClient())

  const container = {
    amqp,
    httpClient,
    db: mongoDbConnection.getClient(),
  }

  const api = new Api(container)
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

//todo:
/*
 * chamar a api e capturar os dados, em loop, paginando OK
 * gravar em bulk insert //em dev
 * criar use case de listagem
 * criar frontend para agendar
 * criar frontend para listar
 */
