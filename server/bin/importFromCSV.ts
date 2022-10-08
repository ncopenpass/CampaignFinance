#!/usr/bin/env node
import { getClient } from '../db'
import { copyFromCSV } from '../db/copyFromCSV'

const tableName = process.argv[2]
const filePath = process.argv[3]

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
