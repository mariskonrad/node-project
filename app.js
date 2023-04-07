const fs = require('fs')

const framework = require('./framework')

const app = framework()

app.get('/', (req, res) => {
  fs.readFile(__dirname + '/static/home.html', (err, data) => {
    if (err) throw err
    res.end(data)
  })
})

app.get('/login', (req, res) => {
  fs.readFile(__dirname + '/static/login.html', (err, data) => {
    if (err) throw err
    res.end(data)
  })
})

app.post('/login', (req, res) => {
  res.end()
})

module.exports = app
