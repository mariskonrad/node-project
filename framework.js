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

    const handlers = urlHandlers[method]
    let i = 0
    const runHandler = () => {
      let callNext = false
      handlers[i](req, res, () => {
        callNext = true
      })
      i++

      if (callNext) {
        runHandler()
      }
    }
    runHandler()
  })

  const app = {
    get: (route, ...handlers) => {
      routes[route] = { ...routes[route], GET: handlers }
    },
    post: (route, ...handlers) => {
      routes[route] = { ...routes[route], POST: handlers }
    },
    listen: (port, hostname, callback) => {
      server.listen(port, hostname, callback)
    }
  }

  return app
}
