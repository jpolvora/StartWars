import { GetAllUseCase } from '../application/useCases/GetAllUseCase.js'
import { GetByIdUseCase } from '../application/useCases/GetByIdUseCase.js'
import { Services } from '../infra/Services.js'

export function addPersonagensRoutes(router, container) {
  const personagens = container.get(Services.personagens)

  router.get('/personagens', async (req, res) => {
    const useCase = new GetAllUseCase(personagens)
    const result = await useCase.execute()

    return res
      .status(200)
      .json({
        success: true,
        data: result,
      })
      .end()
  })

  router.get('/personagens/:id', async (req, res) => {
    const id = Number(req.params.id)

    if (id) {
      const useCase = new GetByIdUseCase(personagens)
      const result = await useCase.execute(id)

      return res.json({
        success: true,
        data: result,
      })
    }

    return res.status(404).end()
  })
}
