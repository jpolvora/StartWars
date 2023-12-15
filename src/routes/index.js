export default (router) => {
  router.get('/', (_, res) => {
    return res.json({
      success: true,
      message: 'root',
    })
  })
}
