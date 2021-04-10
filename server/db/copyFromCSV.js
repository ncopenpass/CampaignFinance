// @ts-check
const fs = require('fs')
const copyFrom = require('pg-copy-streams').from

/**
 *
 * @param {string} path
 * @param {string} tableName
 * @param {import('pg').PoolClient} client
 */
const copyFromCSV = (path, tableName, client) =>
  new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(path)
    const stream = client.query(
      copyFrom(
        `COPY ${tableName} FROM STDIN DELIMITER ',' csv HEADER NULL 'NULL'`
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
