import express from 'express'
import { getIndexRouter, getImportRouter } from './routes/index.js'

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

    const routers = [getIndexRouter, getImportRouter]

    for (const router of routers) {
      this.app.use('/api', router())
    }

    return this.app
  }
}
