const { PORT: port = 3001 } = process.env

import app from './app'

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})
