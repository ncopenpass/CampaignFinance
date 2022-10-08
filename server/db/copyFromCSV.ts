import fs from 'fs'
import * as copyStream from 'pg-copy-streams'
import { PoolClient } from 'pg'

const copyFrom = copyStream.from

/**
 *
 * @param {string} path
 * @param {string} tableName
 * @param {import('pg').PoolClient} client
 * @param {string} headers comma delimited string of header fields in order they appear in CSV file
 */
export const copyFromCSV = (
  path: string,
  tableName: string,
  client: PoolClient,
  headers = '',
  nullDelimiter = ''
) =>
  new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(path)
    const stream = client.query(
      copyFrom(
        `COPY ${tableName}${
          headers ? `(${headers})` : ''
        } FROM STDIN DELIMITER ',' csv HEADER NULL '${nullDelimiter}'`
      )
    )
    fileStream.on('error', (error) => {
      reject(error)
    })
    stream.on('error', (error) => {
      reject(error)
    })
    fileStream.pipe(stream).on('finish', () => {
      resolve(null)
    })
  })
