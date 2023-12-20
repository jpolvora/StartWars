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
  PersonagensCollection,
  Registry,
  Services,
} from './infra/index.js'
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

  //protect services overriding
  container.build()

  try {
    const retryOptions = { retries: 9, retryIntervalMs: 1000 }

    //await all promises in parallel
    const serverPromise = retry(() => server.listen(), retryOptions)
    const amqpPromise = retry(() => amqp.listen(), retryOptions)
    const mongoDbPromise = retry(() => mongoDbAdapter.connect(), retryOptions)

    await Promise.all([serverPromise, amqpPromise, mongoDbPromise])

    console.log('all services connected successfully')

    server.shutDownFn = configureGracefulShutdown(
      server.httpServer,
      env.NODE_ENV,
      async (signal) => {
        await mongoDbAdapter.disconnect()
        await amqp.close()
      }
    )
  } catch (e) {
    throw new Error(`error on trying to run Application: ${e}`)
  }
}

start().catch(console.error.bind(console))

//todo:
/*
 * chamar a api e capturar os dados, em loop, paginando OK
 * gravar em bulk insert OK
 * criar use case de listagem OK
 * criar docker-compose OK
 * melhorar testes //cobrir 100%
 * swagger OK
 * refatoracao container OK - melhorar através de proxy
 */
