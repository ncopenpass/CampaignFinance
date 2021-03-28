const express = require('express')
const search = require('./search')
const candidate = require('./candidate')
const contributor = require('./contributor')

const api = express.Router()
api.use(express.json())

api.use(search)
api.use(candidate)
api.use(contributor)

module.exports = api
