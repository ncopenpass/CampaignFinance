// @ts-check
import { Pool } from 'pg'
require('dotenv').config()
import QueryStream from 'pg-query-stream'
import { Transform } from 'json2csv'
import { Response } from 'express'

const pool = new Pool({
  connectionString:
    process.env.NODE_ENV === 'test'
      ? process.env.TEST_DATABASE_URL
      : process.env.DATABASE_URL,
  ssl:
    !process.env.DB_IGNORE_SSL && process.env.NODE_ENV === 'production'
      ? {
          rejectUnauthorized: false,
        }
      : undefined,
  min: 1,
})

export const query = (text: string, params: any[]) => pool.query(text, params)

export const getClient = () => pool.connect()

export const streamQueryToCSV = (
  res: Response,
  text: string,
  args: any[],
  transformFn?: json2csv.Json2CsvTransform<any, any>
) =>
  new Promise((resolve, reject) =>
    pool.connect((err, client, done) => {
      if (err) {
        done()
        reject(err)
      }
      const query = new QueryStream(text, args)

      const stream = client.query(query)
      stream.on('end', () => {
        done()
        resolve(null)
      })
      stream.on('error', (err) => {
        done()
        reject(err)
      })

      const transformOpts = { objectMode: true }
      const json2csv = new Transform(
        { transforms: transformFn ? [transformFn] : undefined },
        transformOpts
      )

      stream.pipe(json2csv).pipe(res)
    })
  )
