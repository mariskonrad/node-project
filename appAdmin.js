const framework = require('./framework')

const appAdmin = framework()

appAdmin.get('/', (req, res) => {
  res.render('admin')
})

module.exports = appAdmin
