#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const copyTo = require('pg-copy-streams').to
const { getClient } = require('../db')

const DIRECTORY = process.argv[2] || './'

const tables = ['contributors', 'contributions']

const streamToFile = (client, table = '') =>
  new Promise((resolve, reject) => {
    const stream = client.query(
      copyTo(`COPY ${table} TO STDOUT DELIMITER ',' csv header`)
    )

    // `COPY ${tableName} (${columns}) FROM STDIN DELIMITER ',' csv HEADER`,
    const toFile = fs.createWriteStream(path.join(DIRECTORY, `${table}.csv`), {
      encoding: 'utf8',
    })
    stream.pipe(toFile)
    stream.on('end', resolve)
    stream.on('error', reject)
    toFile.on('error', reject)
    // toFile.on('end', resolve)
  })

;(async () => {
  let client = null
  try {
    client = await getClient()
    for (const table of tables) {
      console.log(`Copying table: ${table}`)
      await streamToFile(client, table)
    }
  } catch (err) {
    console.error('Unable to copy from table', err)
  } finally {
    client.release()
  }
})()
