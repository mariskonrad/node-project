const http = require('http')
const fs = require('fs')

const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/html')

  switch (req.url) {
    case '/':
      fs.readFile(__dirname + '/static/home.html', (err, data) => {
        if (err) throw err
        res.end(data)
      })
      break
    case '/login':
      fs.readFile(__dirname + '/static/login.html', (err, data) => {
        if (err) throw err
        res.end(data)
      })
      break
    default:
      fs.readFile(__dirname + '/static/not_found.html', (err, data) => {
        if (err) throw err
        res.statusCode = 404
        res.end(data)
      })
      break
  }
})

const hostname = '0.0.0.0'
const port = 3000

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
