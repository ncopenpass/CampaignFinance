// @ts-check
const { Pool } = require('pg')
require('dotenv').config()
const QueryStream = require('pg-query-stream')
const { Transform } = require('json2csv')

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

/**
 *
 * @param {string | import('pg').QueryConfig<any[]>} text
 * @param {any[]} params
 * @returns {Promise<import('pg').QueryResult>}
 */
const query = (text, params) => pool.query(text, params)
/**
 * @returns {Promise<import('pg').PoolClient>}
 */
const getClient = () => pool.connect()

/**
 *
 * @param {import('express').Response} res
 * @param {string} text
 * @param {any[]} args
 * @param {import('json2csv').Json2CsvTransform<any, any>|undefined} transformFn
 * @returns
 */
const streamQueryToCSV = (res, text, args, transformFn) =>
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

module.exports = {
  query,
  getClient,
  streamQueryToCSV,
}
