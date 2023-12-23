import { randomUUID } from 'crypto'
import { ManutencaoClearPersonagensUseCase } from '../application/useCases/ManutencaoClearPersonagensUseCase.js'
import { Services } from '../infra/Services.js'

export function addManutencaoRoutes(router, container) {
  const personagens = container.get(Services.db).getPersonagens()

  return router
    .get('/manutencao', async (req, res) => {
      const result = {
        uuid: randomUUID(),
      }

      return res.status(200).json(result).end()
    })
    .post('/manutencao', async (req, res) => {
      //todo: validation uuid
      const id = req.body.uuid || false
      if (id) {
        const useCase = new ManutencaoClearPersonagensUseCase(personagens)
        const result = await useCase.execute(id)

        return res.json({
          success: !!result,
        })
      }

      return res.status(422).end()
    })
}
