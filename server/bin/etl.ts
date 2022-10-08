#!/usr/bin/env node

import 'fs'
import { PoolClient } from 'pg'
import { getClient } from '../db'
import { copyFromCSV } from '../db/copyFromCSV'
;(async () => {
  let client: PoolClient | null = null
  try {
    client = await getClient()
    const truncate = await client.query(
      'truncate accounts, transactions, committees'
    )
    console.log({ truncate }, 'truncate response')
    console.log('importing from accounts.csv')
    await copyFromCSV(
      `${__dirname}/../tmp/accounts.csv`,
      'accounts',
      client,
      `"account_id","name","city","state","zip_code","profession","employer_name","is_donor","is_vendor","is_person","is_organization"`
    )

    console.log('importing from transactions.csv')
    await copyFromCSV(
      `${__dirname}/../tmp/transactions.csv`,
      'transactions',
      client,
      `"source_transaction_id","contributor_id","transaction_type","committee_name","canon_committee_sboe_id","transaction_category","date_occurred","amount","report_name","account_code","form_of_payment","purpose","candidate_referendum_name","declaration","original_committee_sboe_id"`
    )
    console.log('importing from committees.csv')
    await copyFromCSV(
      `${__dirname}/../tmp/committees.csv`,
      'committees',
      client,
      `"sboe_id","committee_name","committee_type","committee_street_1","committee_street_2","committee_city","committee_state","committee_full_zip","candidate_full_name","candidate_first_last_name","candidate_first_name","candidate_last_name","candidate_middle_name","party","office","juris","current_status"`
    )
    console.log('rebuilding indexes')
    await client.query(
      `create index if not exists candidate_name_trgm_idx on committees using gin (candidate_last_name gin_trgm_ops, candidate_first_last_name gin_trgm_ops, candidate_full_name gin_trgm_ops)`
    )
    await client.query(`reindex index candidate_name_trgm_idx`)
  } catch (error) {
    console.error(error)
  } finally {
    if (client) {
      client.release()
    }
  }
})()
