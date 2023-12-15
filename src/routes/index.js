import express from 'express'

export function getIndexRouter() {
  const router = express.Router()
  router.get('/', (_, res) => {
    return res.status(200).end()
  })

  return router
}

export * from './import.js'
