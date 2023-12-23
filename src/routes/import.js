import { randomUUID } from 'crypto'
import { ScheduleImportUseCase } from '../application/useCases/ScheduleImportUseCase.js'

export function addImportRoutes(router, container) {
  //todo: validation uuid
  return router
    .get('/import', async (_, res) => {
      const result = {
        uuid: randomUUID(),
      }

      return res.status(200).json(result).end()
    })
    .post('/import', async (req, res) => {
      if (req.body.uuid) {
        const useCase = new ScheduleImportUseCase(container)
        const result = await useCase.execute(req.body.uuid)
        return res.status(201).json(result).end()
      }

      return res.status(400).end()
    })
}
