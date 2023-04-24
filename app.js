const { v4: uuidv4 } = require('uuid')

const framework = require('./framework')
const users = require('./db/users')

const app = framework()

const sessions = {}
const SESSION_ID = 'sessionId'

app.get('/', (req, res) => {
  res.render('home')
})

app.get('/login', (req, res) => {
  res.render('login')
})

app.post('/login', (req, res) => {
  const buffer = []

  req.on('data', chunk => {
    buffer.push(chunk)
  })

  req.on('end', () => {
    const body = Buffer.concat(buffer).toString()
    const params = new URLSearchParams(body)

    const username = params.get('username')
    const password = params.get('password')

    if (!(username in users) && !users[username] === password) {
      res.statusCode = 401
      res.render('login')
      return
    }
    const uuid = uuidv4()
    sessions[uuid] = username
    res.setHeader('Set-Cookie', `sessionId=${uuid}`)
    res.statusCode = 302
    res.setHeader('Location', '/profile')
    res.end()
  })
})

app.get('/profile', (req, res) => {
  if (validateAuth(req, res)) {
    return
  }
  res.render('profile')
})

app.post('/logout', (req, res) => {
  if (validateAuth(req, res)) {
    return
  }

  res.setHeader('Set-Cookie', `sessionId=deleted; expires=Thu, 01 Jan 1970 00:00:00 GMT`)
  res.statusCode = 302
  res.setHeader('Location', '/')
  res.end()
})

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

const validateAuth = (req, res) => {
  const parsedCookies = parseCookie(req)

  if (SESSION_ID in parsedCookies && parsedCookies[SESSION_ID] in sessions) {
    return false
  }

  res.statusCode = 302
  res.setHeader('Location', '/login')
  res.end()
  return true
}

module.exports = app
