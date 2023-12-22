import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { addImportRoutes, addPersonagensRoutes } from '../routes/index.js'

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

    const env = this.#container.get(Services.env)
    const enableSwagger = !!env.ENABLE_SWAGGER

    //FEATURE FLAG
    if (enableSwagger) {
      const swaggerFile = await import('../swagger-output.json', {
        assert: {
          type: 'json',
        },
      })

      app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile.default))
    }

    //import all routes here
    const routes = [addImportRoutes, addPersonagensRoutes]

    for (const addRoute of routes) {
      const router = express.Router()
      addRoute(router, this.#container)
      app.use('/api', express.json(), helmet(), cors(), router)
    }

    // app.use((req, res, next) => {
    //   res.status(404).send("Sorry can't find that!")
    // })

    // custom error handler
    // app.use((err, req, res, next) => {
    //   console.error(err.stack)
    //   res.status(500).send('Something broke!')
    // })

    this.#app = app
    return app
  }
}
