export * from './import.js'
export * from './personagens.js'

export function addIndexRoutes(router) {
  router.get('/', (_, res) => {
    return res.status(200).end()
  })
}
