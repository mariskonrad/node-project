const { v4: uuidv4 } = require('uuid')

const framework = require('./framework')
const users = require('./db/users')

const app = framework()

const SESSION_ID = 'sessionId'

const sessions = {}

const cookieParserMiddleware = (req, res, next) => {
  const parseCookie = req => {
    const cookies = req.headers.cookie

    return (
      cookies?.split('; ').reduce((acc, curr) => {
        currSplitted = curr.split('=')
        acc[currSplitted[0]] = currSplitted[1]
        return acc
      }, {}) ?? {}
    )
  }

  req.cookies = parseCookie(req)
  next()
}

const bodyParserMiddleware = (req, res, next) => {
  const buffer = []

  req.on('data', chunk => {
    buffer.push(chunk)
  })

  req.on('end', () => {
    const body = Buffer.concat(buffer).toString()
    req.body = new URLSearchParams(body)
    next()
  })
}

const validateAuthMiddleware = (req, res, next) => {
  if (SESSION_ID in req.cookies && req.cookies[SESSION_ID] in sessions) {
    next()
    return
  }

  res.statusCode = 302
  res.setHeader('Location', '/login')
  res.end()
}

app.get('/', (req, res) => {
  res.render('home')
})

app.get('/login', (req, res) => {
  res.render('login')
})

app.post('/login', bodyParserMiddleware, (req, res) => {
  const username = req.body.get('username')
  const password = req.body.get('password')

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

app.get('/profile', cookieParserMiddleware, validateAuthMiddleware, (req, res) => {
  res.render('profile')
})

app.post('/logout', cookieParserMiddleware, validateAuthMiddleware, (req, res) => {
  res.setHeader('Set-Cookie', `${SESSION_ID}=deleted; expires=Thu, 01 Jan 1970 00:00:00 GMT`)
  res.statusCode = 302
  res.setHeader('Location', '/')
  res.end()
})

module.exports = app
