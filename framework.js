const http = require('http')
const fs = require('fs')

const notFoundHandler = (req, res) => {
  fs.readFile(__dirname + '/static/not_found.html', (err, data) => {
    if (err) throw err
    res.statusCode = 404
    res.end(data)
  })
}

module.exports = function framework() {
  const routes = {}

  const server = http.createServer((req, res) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html')

    if (req.url in routes) {
      routes[req.url](req, res)
    } else {
      notFoundHandler(req, res)
    }
  })

  return {
    register: (route, handler) => {
      routes[route] = handler
    },
    listen: (port, hostname, callback) => {
      server.listen(port, hostname, callback)
    }
  }
}
