import { randomUUID } from 'crypto'
import { ScheduleImport } from '../application/useCases/ScheduleImport.js'

export function addImportRoutes(router, container) {
  router.get('/import', async (_, res) => {
    const result = {
      uuid: randomUUID(),
    }

    return res.status(200).json(result).end()
  })

  router.post('/import', async (req, res) => {
    if (req.body.uuid) {
      var useCase = new ScheduleImport(container.amqp)
      var result = await useCase.execute(req.body.uuid)
      return res.status(201).json(result).end()
    }

    return res
      .status(400)
      .json({
        success: false,
      })
      .end()
  })
}
