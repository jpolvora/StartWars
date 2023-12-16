import { GetList } from '../application/useCases/GetList.js'
import { GetSingle } from '../application/useCases/GetSingle.js'

export function addPersonagensRoutes(router, container) {
  router.get('/personagens', async (req, res) => {
    const useCase = new GetList(container)
    const result = await useCase.execute(req.params.page)

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
      const useCase = new GetSingle(container)
      const result = await useCase.execute(id)

      return res.json({
        success: true,
        data: result,
      })
    }

    return res.status(404).end()
  })
}
