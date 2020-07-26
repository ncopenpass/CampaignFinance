#!/usr/bin/env node
const fs = require('fs')
const stream = require('stream')
const copyFrom = require('pg-copy-streams').from
const { getClient } = require('../db')
const { after } = require('lodash')

const tableName = process.argv[2]
const filePath = process.argv[3]

/**
 *
 * @param {*} fileStream
 * @param {string} tableName
 * @param {object} client
 * @param {string}  columns
 */
const copyFromCSV = (path, tableName, client) =>
  new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(path)
    const stream = client.query(
      copyFrom(`COPY ${tableName} FROM STDIN DELIMITER ',' csv HEADER`)
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

const init = () => {
  if (!filePath || !tableName) {
    console.error(
      'tableName or filepath is invalid. Please provide both as `node bin/importFromCSV my_table path/to/file.csv'
    )
    console.error({ filePath, tableName })
    process.exit(1)
  }
}

;(async () => {
  let client = null
  try {
    init()
    client = await getClient()
    const beforeCount = (
      await client.query(`select count(*) from ${tableName}`)
    ).rows
    console.log('Count before', beforeCount[0].count)
    await copyFromCSV(filePath, tableName, client)
    const afterCount = (await client.query(`select count(*) from ${tableName}`))
      .rows
    console.log('Count after', afterCount[0].count)
  } catch (err) {
    console.error(err)
  } finally {
    if (client) {
      client.release()
    }
  }
})()
