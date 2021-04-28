const v1 = require('../api/v1/index')

const routes = (app) => {
  app.use('/v1/', v1)
}

module.exports = routes
