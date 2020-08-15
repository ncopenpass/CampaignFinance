const express = require('express')
const bodyParser = require('body-parser')

const api = require('./api')

const app = express()
app.use(bodyParser.json())
app.use('/api', api)
app.get('/status', (req, res) => res.send({ status: 'online' }))

module.exports = app
