#!/usr/bin/env node
// @ts-check

require('fs')
const { getClient } = require('../db')
const { copyFromCSV } = require('../db/copyFromCSV')

;(async () => {
  let client = null
  try {
    client = await getClient()
    const truncate = await client.query(
      'truncate accounts, transactions, committees'
    )
    console.log({ truncate }, 'truncate response')
    await copyFromCSV(
      `${__dirname}/../tmp/accounts.csv`,
      'accounts',
      client,
      `"account_id","name","city","state","zip_code","profession","employer_name","is_donor","is_vendor","is_person","is_organization"`
    )
    await copyFromCSV(
      `${__dirname}/../tmp/transactions.csv`,
      'transactions',
      client,
      `"source_transaction_id","contributor_id","transaction_type","committee_name","canon_committee_sboe_id","transaction_category","date_occurred","amount","report_name","account_code","form_of_payment","purpose","candidate_referendum_name","declaration","original_committee_sboe_id"`
    )
    await copyFromCSV(
      `${__dirname}/../tmp/committees.csv`,
      'committees',
      client,
      `"sboe_id","committee_name","committee_type","committee_street_1","committee_street_2","committee_city","committee_state","committee_full_zip","candidate_full_name","candidate_first_last_name","candidate_first_name","candidate_last_name","candidate_middle_name","party","office","juris","current_status"`
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
