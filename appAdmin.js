const framework = require('./framework')

const appAdmin = framework()

appAdmin.get('/', (req, res) => {
  res.end('admin')
})

module.exports = appAdmin
