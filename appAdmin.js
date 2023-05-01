const express = require('express')

const appAdmin = express()

appAdmin.get('/', (req, res) => {
  res.sendFile('views/admin.html', { root: __dirname })
})

module.exports = appAdmin
