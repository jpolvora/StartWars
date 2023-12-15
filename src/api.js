import express from 'express'
import { readdir } from 'node:fs/promises'
import debug from 'debug'
import { pathToFileURL } from 'url'

const apiDebug = debug('api')

export default class Api {
  constructor() {
    const app = express()

    app.use(express.json())

    this.app = app

    this.isConfigured = false
  }

  async configure(routesPath) {
    if (this.isConfigured) return

    this.isConfigured = true

    const files = await readdir(routesPath)

    for (const file of files) {
      if (file.endsWith('.js')) {
        const router = express.Router()
        const fullFilePathModule = pathToFileURL(`${routesPath}/${file}`)
        apiDebug('importing %s', fullFilePathModule)
        ;(await import(fullFilePathModule)).default(router)
        this.app.use(router)
      }
    }
  }

  getExpressApp() {
    return this.app
  }
}
