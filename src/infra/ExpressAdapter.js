import express from 'express'
import {
  addIndexRoutes,
  addImportRoutes,
  addPersonagensRoutes,
} from '../routes/index.js'

import swaggerUi from 'swagger-ui-express'
import swaggerFile from '../swagger-output.json' assert { type: 'json' }

export class ExpressAdapter {
  isConfigured = false

  constructor(container) {
    this.container = container

    const app = express()

    //place here all needed middlewares

    app.use(express.static('public'))
    app.use(express.json())

    this.app = app

    this.isConfigured = false
  }

  initialize() {
    if (this.isConfigured) return this.app
    this.isConfigured = true

    const routes = [addIndexRoutes, addImportRoutes, addPersonagensRoutes]

    for (const useRoute of routes) {
      const router = express.Router()
      useRoute(router, this.container)
      this.app.use('/api', router)
    }

    this.app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

    return this.app
  }
}
