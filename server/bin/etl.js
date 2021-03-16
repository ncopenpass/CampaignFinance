#!/usr/bin/env node
// @ts-check

require('fs')
const { getClient } = require('../db')
const { copyFromCSV } = require('../db/copyFromCSV')

;(async () => {
  let client = null
  try {
    client = await getClient()
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
    await copyFromCSV(
      `${__dirname}/../tmp/committees.csv`,
      'committees',
      client
    )
    // await client.query(
    //   'alter table committees add column candidate_full_name text'
    // )
    // await client.query(
    //   'alter table committees add column candidate_first_last_name text'
    // )
    await client.query(
      `update committees set candidate_full_name = CONCAT_WS(' ', candidate_first_name, candidate_middle_name, candidate_last_name)`
    )
    await client.query(
      `update committees set candidate_first_last_name = CONCAT_WS(' ', candidate_first_name, candidate_last_name)`
    )
    await client.query(
      `create index if not exists candidate_name_trgm_idx on committees using gin (candidate_last_name gin_trgm_ops, candidate_first_last_name gin_trgm_ops, candidate_full_name gin_trgm_ops)`
    )
    await client.query(`reindex index candidate_name_trgm_idx`)
  } catch (error) {
    console.error(error)
  } finally {
    if (client !== null) {
      client.release()
    }
  }
})()
