import express from 'express'
import {
  addIndexRoutes,
  addImportRoutes,
  addPersonagensRoutes,
} from './routes/index.js'

export default class Api {
  isConfigured = false

  constructor() {
    const app = express()

    //place here all needed middlewares
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
      useRoute(router)
      this.app.use('/api', router)
    }

    return this.app
  }
}
