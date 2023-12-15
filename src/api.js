import express from "express"

export default class Api {
  constructor() {
    this.app = express()
    this.app.use(express.json())
  }

  getExpressApp() {
    return this.app
  }
}
