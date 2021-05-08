// @ts-check
const fs = require('fs')
const copyFrom = require('pg-copy-streams').from

/**
 *
 * @param {string} path
 * @param {string} tableName
 * @param {import('pg').PoolClient} client
 * @param {string} headers comma delimited string of header fields in order they appear in CSV file
 */
const copyFromCSV = (
  path,
  tableName,
  client,
  headers = '',
  nullDelimiter = 'NULL'
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
      resolve()
    })
  })

module.exports = {
  copyFromCSV,
}
