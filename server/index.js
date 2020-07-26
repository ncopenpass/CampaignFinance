const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())
const { PORT: port = 3001 } = process.env

app.get('/status', (req, res) => res.send({ status: 'online' }))
app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})
