const express = require('express')
const cookieParser = require('cookie-parser')
const { v4: uuidv4 } = require('uuid')
const morgan = require('morgan')
const Redis = require('ioredis')

const app = express()
const redis = new Redis({
  port: 6379,
  host: 'redis',
})

const users = require('./db/users')

const SESSION_ID = 'sessionId'

app.set('view engine', 'pug')
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(morgan('combined'))

app.get('/', (req, res) => {
  res.render('home')
})

app.get('/login', (req, res) => {
  res.render('login')
})

const validateAuthMiddleware = (req, res, next) => {
  if (!(SESSION_ID in req.cookies)) {
    res.redirect(302, '/login')
    res.end()
    return
  }

  redis.get(req.cookies[SESSION_ID])
    .then((result) => {
      if (result) {
        next()
        return
      }
      res.redirect(302, '/login')
      res.end()
    })
}

app.get('/profile', validateAuthMiddleware, (req, res) => {
  res.render('profile')
})

app.post('/login', (req, res) => {
  const { username } = req.body
  const { password } = req.body

  if (!(username in users) && !users[username] === password) {
    res.redirect(401, '/login')
    return
  }

  const uuid = uuidv4()

  redis.set(uuid, username)
    .then(() => {
      res.cookie(SESSION_ID, uuid)
      res.redirect(302, '/profile')
      res.end()
    })
})

app.post('/logout', validateAuthMiddleware, (req, res) => {
  redis.del(req.cookies[SESSION_ID])
    .then(() => {
      res.clearCookie(SESSION_ID)
      res.redirect(302, '/')
      res.end()
    })
})

module.exports = app
