#!/usr/bin/env node
// @ts-check

require('fs')
const { getClient } = require('../db')
const { copyFromCSV } = require('../db/copyFromCSV')

;(async () => {
  let client = null
  try {
    client = await getClient()
    await copyFromCSV(`${__dirname}/../tmp/accounts.csv`, 'accounts', client)
    await copyFromCSV(
      `${__dirname}/../tmp/transactions.csv`,
      'transactions',
      client,
      `"source_transaction_id","contributor_id","transaction_type","transaction_category","committee_name","canon_committee_sboe_id","committee_street_1","committee_street_2","committee_city","committee_state","committee_zip_code","report_name","date_occurred","account_code","amount","form_of_payment","purpose","candidate_referendum_name","declaration","original_account_id","original_committee_sboe_id"`
    )
    await copyFromCSV(
      `${__dirname}/../tmp/committees.csv`,
      'committees',
      client,
      `"sboe_id","committee_name","committee_type","committee_street_1","committee_street_2","committee_city","committee_state","committee_full_zip","candidate_first_name","candidate_middle_name","candidate_last_name","candidate_full_name","candidate_first_last_name","treasurer_first_name","treasurer_middle_name","treasurer_last_name","treasurer_email","asst_treasurer_first_name","asst_treasurer_middle_name","asst_treasurer_last_name","asst_treasurer_email","treasurer_street_1","treasurer_street_2","treasurer_city","treasurer_state","treasurer_full_zip","party","office","juris"`
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
