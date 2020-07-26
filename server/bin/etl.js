#!/usr/bin/env node
// @ts-check

require('fs')
const { getClient } = require('../db')
const { copyFromCSV } = require('../db/copyFromCSV')

;(async () => {
  const client = await getClient()
  await copyFromCSV(
    `${__dirname}/../tmp/contributors.csv`,
    'contributors',
    client
  )
  await copyFromCSV(
    `${__dirname}/../tmp/contributions.csv`,
    'contributions',
    client
  )
  client.release()
})()
