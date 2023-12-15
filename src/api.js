import express from 'express'
import { getIndexRouter, getImportRouter } from './routes/index.js'

export default class Api {
  isConfigured = false

  constructor() {
    const app = express()

    app.use(express.json())

    this.app = app

    this.isConfigured = false
  }

  async configure() {
    if (this.isConfigured) return
    this.isConfigured = true

    const routers = [getIndexRouter(), getImportRouter()]

    for (const router of routers) {
      this.app.use('/api', router)
    }
  }

  getExpressApp() {
    return this.app
  }
}
