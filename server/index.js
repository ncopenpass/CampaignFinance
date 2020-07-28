const express = require('express')
const bodyParser = require('body-parser')
const { getClient } = require('./db')
const { searchContributors } = require('./lib/search')
const app = express()
app.use(bodyParser.json())
const { PORT: port = 3001 } = process.env
const TRIGRAM_LIMIT = 0.6

const api = express.Router()
api.get('/search/contributors/:name', async (req, res) => {
  try {
    const { name } = req.params
    const { offset = 0, limit = 50 } = req.query
    const decodedName = decodeURIComponent(name)

    const contributors = await searchContributors(
      decodedName,
      offset,
      limit,
      TRIGRAM_LIMIT
    )
    res.send(contributors)
  } catch (error) {
    console.error(error)
    res.status(500)
    res.send({
      error: 'unable to process request',
    })
  }
})

app.use('/api', api)
app.get('/status', (req, res) => res.send({ status: 'online' }))
app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})
