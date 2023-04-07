const http = require('http')

module.exports = function framework() {
  const routes = {}
  const server = http.createServer((req, res) => {
    if (req.url in routes) {
      routes[req.url](req, res)
    } else {
      res.statusCode = 404
      res.setHeader('Content-Type', 'text/html')
      res.end('<p>Not found</p>')
    }
  })

  const app = {
    register: (route, handler) => {
      routes[route] = handler
    },
    listen: (port, hostname, callback) => {
      server.listen(port, hostname, callback)
    }
  }

  return app
}
