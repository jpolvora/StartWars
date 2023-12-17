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
import { Registry } from './infra/container.js'
import { Services } from './infra/Services.js'

async function start() {
  const container = Registry.instance
  container.set(Services.env, env)
  container.set(Services.httpClient, new Axios({ baseURL: env.API_URL }))

  const mongoDbAdapter = new MongoDbAdapter(env.MONGODB_URI, 'startwars')

  container.set(
    Services.personagens,
    new PersonagensCollection(mongoDbAdapter.db)
  )

  container.set(Services.queue, new RabbitMQAdapter(env.AMQP_URL))
  const amqp = new AmqpServer(container)
  container.set(Services.amqp, amqp)
  const server = new HttpServer(new ExpressAdapter(container), env.PORT)

  try {
    await Promise.all[
      (server.listen(), amqp.listen(), mongoDbAdapter.connect())
    ]

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
