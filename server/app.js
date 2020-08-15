const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

const api = require('./api')

const app = express()
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
