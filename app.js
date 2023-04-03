const fs = require('fs')

const framework = require('./framework')

const app = framework()

app.register('/', (req, res) => {
  fs.readFile(__dirname + '/static/home.html', (err, data) => {
    if (err) throw err
    res.end(data)
  })
})

app.register('/login', (req, res) => {
  fs.readFile(__dirname + '/static/login.html', (err, data) => {
    if (err) throw err
    res.end(data)
  })
})

const hostname = '0.0.0.0'
const port = 3000

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
