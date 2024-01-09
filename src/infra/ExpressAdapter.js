import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import favicon from 'express-favicon'

import { addImportRoutes, addManutencaoRoutes, addPersonagensRoutes } from '../routes/index.js'
import swaggerUi from 'swagger-ui-express'
import { Services } from './Services.js'

export class ExpressAdapter {
  #container = null
  #isConfigured = false
  #app = null

  constructor(container) {
    this.#container = container
  }

  async initialize() {
    if (this.#isConfigured && this.#app) return this.#app
    this.#isConfigured = true

    const app = express()

    //place here all needed middlewares

    app.use(express.static('public'))

    app.use(favicon('./public/favicon.png'))

    const env = this.#container.get(Services.env)
    const enableSwagger = !!env.ENABLE_SWAGGER

    //FEATURE FLAG
    if (enableSwagger) {
      const swaggerFile = await import('../swagger-output.json', {
        assert: {
          type: 'json',
        },
      })

      //replace generated hardcoded "host" in file with env Variable value
      swaggerFile.default.host = env.HOST

      app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile.default))
    }

    //import all routes here
    const routes = [addImportRoutes, addPersonagensRoutes, addManutencaoRoutes]

    for (const addRoute of routes) {
      const router = express.Router()
      addRoute(router, this.#container)
      app.use('/api', express.json(), helmet(), cors(), router)
    }

    this.#app = app
    return app
  }
}
