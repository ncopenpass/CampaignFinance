import express, { Request, Response, NextFunction } from 'express'
import path from 'path'

const enforceSSL = (req: Request, res: Response, next: NextFunction) => {
  const proto = req.headers['x-forwarded-proto']
  if (proto === 'http') {
    const host = req.headers['host'] ? req.headers['host'] : req.hostname
    return res.redirect(301, 'https://' + host + req.url)
  }
  next()
}

const logHandlerTime = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now()

  req.on('end', () => {
    const totalTimeMs = Date.now() - startTime
    const totalTimeSecs = totalTimeMs / 1000
    console.log(
      JSON.stringify({
        totalTimeSecs: totalTimeSecs,
        path: req.path,
      })
    )
  })

  next()
}

const api = require('./api')

const app = express()

// Register this before all other handlers if we are in prod
if (process.env.NODE_ENV === 'production') {
  app.use(enforceSSL)
}

app.use(express.json())
app.use(logHandlerTime)
app.use('/api', api)
app.get('/status', (req, res) => res.send({ status: 'online' }))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')))
  app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
  })
}

export default app
