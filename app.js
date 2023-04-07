const fs = require('fs')

const framework = require('./framework')

const app = framework()

app.get('/', (req, res) => {
  res.render('home')
})

app.get('/login', (req, res) => {
  res.render('login')
})

app.post('/login', (req, res) => {
  res.end()
})

module.exports = app
