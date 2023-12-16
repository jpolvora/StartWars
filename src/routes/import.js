import { randomUUID } from 'crypto'

export function addImportRoutes(router) {
  router.get('/import', (_, res) => {
    return res.json({
      success: true,
      uuid: randomUUID(),
    })
  })

  router.post('/import', (req, res) => {
    if (req.body.uuid) {
      return res
        .status(201)
        .json({
          success: true,
          jobId: randomUUID(),
        })
        .end()
    }

    return res
      .status(400)
      .json({
        success: false,
      })
      .end()
  })
}
