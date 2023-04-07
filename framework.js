const http = require('http')
const fs = require('fs')

module.exports = function framework() {
  const routes = {}
  const server = http.createServer((req, res) => {
    const { url, method } = req

    if (!(url in routes)) {
      res.statusCode = 404
      res.setHeader('Content-Type', 'text/html')
      res.end('<p>Not found</p>')
      return
    }

    const urlHandlers = routes[url]

    if (!(method in urlHandlers)) {
      res.statusCode = 405
      res.setHeader('Content-Type', 'text/html')
      res.end('<p>Method not allowed</p>')
      return
    }

    const viewCache = {}
    res.render = fileName => {
      if (fileName in viewCache) {
        res.end(viewCache[fileName])
        return
      }

      fs.readFile(__dirname + `/views/${fileName}.html`, (err, data) => {
        if (err) throw err

        viewCache[fileName] = data
        res.end(data)
      })
    }

    const handler = urlHandlers[method]
    handler(req, res)
  })

  const app = {
    get: (route, handler) => {
      routes[route] = { ...routes[route], GET: handler }
    },
    post: (route, handler) => {
      routes[route] = { ...routes[route], POST: handler }
    },
    listen: (port, hostname, callback) => {
      server.listen(port, hostname, callback)
    }
  }

  return app
}
