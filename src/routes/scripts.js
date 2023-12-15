export default (router) => {
  router.get('/scripts', (_, res) => {
    return res.json({
      success: true,
      message: 'scripts',
    })
  })
}
