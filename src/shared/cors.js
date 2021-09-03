module.exports = function cors (conf, app) {
  if (conf.cors === false) {
    return
  }

  if (typeof conf.cors === 'function') {
    app.use(conf.cors)
    return
  } 

  app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', req.header('Origin'))
    res.set('Access-Control-Allow-Credentials', 'true')
    res.set('Access-Control-Allow-Headers', req.headers['access-control-request-headers'])
    res.set('Access-Control-Allow-Methods', req.headers['access-control-request-method'])
    next()
  })
}
