const http = require('http')

const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/html')

  switch (req.url) {
    case '/':
      res.end('Home')
      break
    case '/login':
      res.end('Login')
      break
    default:
      res.statusCode = 404
      res.end('Pagina nao encontrada')
      break
  }
})

const hostname = '127.0.0.1'
const port = 3000

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
