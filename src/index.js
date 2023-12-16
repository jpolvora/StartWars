import 'dotenv/config.js'
import { env } from './config/env.js'
import { Axios } from 'axios'
import {
  AmqpServer,
  ExpressAdapter,
  HttpServer,
  configureGracefulShutdown,
  MongoDbAdapter,
  RabbitMQAdapter,
} from './infra/index.js'
import { PersonagensCollection } from './infra/PersonagensCollection.js'

async function start() {
  const httpClient = new Axios({
    baseURL: env.API_URL,
  })

  const mongoDbAdapter = new MongoDbAdapter(env.MONGODB_URI, 'startwars')
  const db = await mongoDbAdapter.connect()
  const personagens = new PersonagensCollection(db)

  const amqp = new AmqpServer(
    new RabbitMQAdapter(env.AMQP_URL),
    httpClient,
    personagens
  )

  const container = {
    amqp,
    httpClient,
    personagens,
    env,
  }

  const api = new ExpressAdapter(container)
  const app = api.initialize()
  const server = new HttpServer(app, env.PORT)

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
 * chamar a api e capturar os dados, em loop, paginando //OK
 * gravar em bulk insert //ok
 * criar use case de listagem
 * criar frontend para agendar
 * criar frontend para listar
 * criar docker-compose
 * melhorar testes
 * refatoracao
 */
