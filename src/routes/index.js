import express from 'express'
export * from './import.js'
export * from './personagens.js'

export function getIndexRouter() {
  const router = express.Router()
  router.get('/', (_, res) => {
    return res.status(200).end()
  })

  return router
}
