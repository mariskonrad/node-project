const express = require('express')
const cookieParser = require('cookie-parser')
const { v4: uuidv4 } = require('uuid')

const app = express()

const users = require('./db/users')
const SESSION_ID = 'sessionId'
const sessions = {}

app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get('/', (req, res) => {
  res.sendFile('views/home.html', { root: __dirname })
})

app.get('/login', (req, res) => {
  res.sendFile('views/login.html', { root: __dirname })
})

const validateAuthMiddleware = (req, res, next) => {
  if (SESSION_ID in req.cookies && req.cookies[SESSION_ID] in sessions) {
    next()
    return
  }

  res.statusCode = 302
  res.setHeader('Location', '/login')
  res.end()
}

app.get('/profile', validateAuthMiddleware, (req, res) => {
  res.sendFile('views/profile.html', { root: __dirname })
})

app.post('/login', (req, res) => {
  const username = req.body.username
  const password = req.body.password

  if (!(username in users) && !users[username] === password) {
    res.statusCode = 401
    res.render('login')
    return
  }

  const uuid = uuidv4()
  sessions[uuid] = username
  res.setHeader('Set-Cookie', `${SESSION_ID}=${uuid}`)
  res.statusCode = 302
  res.setHeader('Location', '/profile')
  res.end()
})

app.post('/logout', validateAuthMiddleware, (req, res) => {
  res.setHeader('Set-Cookie', `${SESSION_ID}=deleted; expires=Thu, 01 Jan 1970 00:00:00 GMT`)
  res.statusCode = 302
  res.setHeader('Location', '/')
  res.end()
})

module.exports = app
