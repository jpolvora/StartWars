import { randomUUID } from 'crypto'
import Import from '../application/useCases/Import.js'

export function addImportRoutes(router) {
  router.get('/import', async (_, res) => {
    var useCase = new Import()
    var result = await useCase.execute()
    return res.json(result)
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
