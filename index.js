const app = require('./app')
const appAdmin = require('./appAdmin')

const hostname = '0.0.0.0'
const port = 3000

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})

const portAdmin = 3001

appAdmin.listen(portAdmin, hostname, () => {
  console.log(`Admin running at http://${hostname}:${portAdmin}/`)
})
