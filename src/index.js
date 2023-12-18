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
import { retry } from './utils/index.js'

async function start() {
  const container = Registry.instance
  container.set(Services.env, env)
  container.set(Services.httpClient, new Axios({ baseURL: env.API_URL }))
  const databaseName = 'startwars'
  const mongoDbAdapter = new MongoDbAdapter(env.MONGODB_URI, databaseName)

  container.set(
    Services.personagens,
    new PersonagensCollection(mongoDbAdapter.db)
  )

  container.set(Services.queue, new RabbitMQAdapter(env.AMQP_URL))
  const amqp = new AmqpServer(container)
  container.set(Services.amqp, amqp)
  const server = new HttpServer(new ExpressAdapter(container), env.PORT)

  try {
    const retryOptions = { retries: 9, retryIntervalMs: 1000 }

    await Promise.all[
      (retry(() => server.listen(), retryOptions),
      retry(() => amqp.listen(), retryOptions),
      retry(() => mongoDbAdapter.connect(), retryOptions))
    ]

    server.shutDownFn = configureGracefulShutdown(
      server.httpServer,
      env.NODE_ENV
    )
  } catch (e) {
    throw new Error(`error on trying to run Application: ${e}`)
  }
}

start().catch(console.error.bind(console))

//todo:
/*
 * chamar a api e capturar os dados, em loop, paginando //OK
 * gravar em bulk insert //ok
 * criar use case de listagem
 * criar docker-compose ok
 * melhorar testes
 * refatoracao container
 */
