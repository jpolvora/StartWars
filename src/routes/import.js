import { randomUUID } from 'crypto'
import { ScheduleImportUseCase } from '../application/useCases/ScheduleImportUseCase.js'
import { ValidatorUUID } from '../application/validators/index.js'

export function addImportRoutes(router, container) {
  //todo: validation uuid

  const validatorUUID = new ValidatorUUID()

  return router
    .get('/import', async (_, res) => {
      const result = {
        uuid: randomUUID(),
      }

      return res.status(200).json(result).end()
    })
    .post('/import', async (req, res) => {
      try {
        if (req.body.uuid) {
          await validatorUUID.validate({ uuid: req.body.uuid })
          const useCase = new ScheduleImportUseCase(container)
          const result = await useCase.execute(req.body.uuid)
          return res
            .status(201)
            .json({
              success: true,
              ...result,
            })
            .end()
        }

        return res.status(400).end()
      } catch (error) {
        return res.status(500).send({
          success: false,
          error: error.message,
          //stack: error.stack,
        })
      }
    })
}
