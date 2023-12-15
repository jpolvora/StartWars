import express from 'express'

export default class Api {
  constructor() {
    this.app = express()
    this.app.use(express.json())

    this.app.get('/', (_, res) => {
      return res
        .json({
          success: true,
          data: [],
        })
        .end()
    })
  }

  getExpressApp() {
    return this.app
  }
}
