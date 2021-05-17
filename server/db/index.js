// @ts-check
const _ = require('lodash')
const { Pool } = require('pg')
require('dotenv').config()

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
 * @param {string} text
 * @param {any[]} params
 * @returns {Promise<import('pg').QueryResult>}
 */
const query = (text, params) => pool.query(text, params)
/**
 * @returns {Promise<import('pg').PoolClient>}
 */
const getClient = () => pool.connect()

module.exports = {
  query,
  getClient,
}
