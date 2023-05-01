const express = require('express')
const cookieParser = require('cookie-parser')
const { v4: uuidv4 } = require('uuid')

const app = express()

const users = require('./db/users')
const SESSION_ID = 'sessionId'
const sessions = {}

app.set('view engine', 'pug')
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get('/', (req, res) => {
  res.render('home')
})

app.get('/login', (req, res) => {
  res.render('login')
})

const validateAuthMiddleware = (req, res, next) => {
  if (SESSION_ID in req.cookies && req.cookies[SESSION_ID] in sessions) {
    next()
    return
  }

  res.redirect(302, '/login')
  res.end()
}

app.get('/profile', validateAuthMiddleware, (req, res) => {
  res.render('profile')
})

app.post('/login', (req, res) => {
  const username = req.body.username
  const password = req.body.password

  if (!(username in users) && !users[username] === password) {
    res.redirect(401, '/login')
    return
  }

  const uuid = uuidv4()
  sessions[uuid] = username
  res.cookie(SESSION_ID, uuid)
  res.redirect(302, '/profile')
  res.end()
})

app.post('/logout', validateAuthMiddleware, (req, res) => {
  res.clearCookie(SESSION_ID)
  res.redirect(302, '/')
  res.end()
})

module.exports = app
