const { PORT: port = 3001 } = process.env

const app = require('./app')

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})
