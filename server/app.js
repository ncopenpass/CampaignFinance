//@ts-check
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const enforceSSL = (req, res, next) => {
  console.log('req.secure', req.secure)
  if (!req.secure) {
    const host = req.headers['host'] ? req.headers['host'] : req.hostname
    return res.redirect(301, 'https://' + host + req.url)
  }
  next()
}

const api = require('./api')

const app = express()

// Register this before all other handlers if we are in prod
if (process.env.NODE_ENV === 'production') {
  app.use(enforceSSL)
}

app.use(bodyParser.json())
app.use('/api', api)
app.get('/status', (req, res) => res.send({ status: 'online' }))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')))
  app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
  })
}

module.exports = app
