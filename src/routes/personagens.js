export function addPersonagensRoutes(router) {
  router.get('/personagens', (_, res) => {
    return res
      .status(200)
      .json({
        success: true,
        data: [],
      })
      .end()
  })

  router.get('/personagens/:id', (req, res) => {
    const id = Number(req.params.id)
    if (id) {
      return res.json({
        success: true,
        data: {
          id,
        },
      })
    }

    return res.status(404).end()
  })
}
