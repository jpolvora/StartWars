import express from 'express'
import { readdirSync } from 'fs'
import debug from 'debug'
import { pathToFileURL } from 'url'

const apiDebug = debug('api')

export default class Api {
  constructor(routesPath) {
    const app = express()
    const router = express.Router()

    app.use(express.json())

    readdirSync(routesPath).map(async (file) => {
      if (file.endsWith('.js')) {
        const fullFilePathModule = pathToFileURL(`${routesPath}/${file}`)

        apiDebug('importing file %s', fullFilePathModule)
        ;(await import(fullFilePathModule)).default(router)
      }
    })

    app.use(router)

    this.app = app
  }

  getExpressApp() {
    return this.app
  }
}
