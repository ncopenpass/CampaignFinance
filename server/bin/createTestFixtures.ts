#! /usr/local/env node

import fs from 'fs'
import path from 'path'
import * as db from '../db'
import json2csv from 'json2csv'

// array: [1, 2, 3] => string: '1, 2, 3'
const toSQLInQueryArgs = (acc: string, val: number | string): string =>
  `${acc}, ${val}`

;(async () => {
  try {
    // Get random list of transactions
    const transactions = (
      await db.query('select * from transactions limit 100 offset random()')
    ).rows

    // Get contributor_id's from result
    const contributorIds: string = transactions
      .map((transaction) => parseInt(transaction.contributor_id))
      .reduce(toSQLInQueryArgs, '')

    const committeeIds: string = transactions
      .map((transaction) => transaction.canon_committee_sboe_id)
      .map((id) => `'${id}'`)
      .reduce(toSQLInQueryArgs, '')

    const accounts = (
      await db.query(
        `select * from accounts where account_id in (${contributorIds})`
      )
    ).rows

    const committees = (
      await db.query(
        `select * from committees where sboe_id in (${committeeIds})`
      )
    ).rows

    fs.writeFileSync(
      path.resolve(`./test/fixtures/transactions.csv`),
      json2csv.parse(transactions)
    )
    fs.writeFileSync(
      path.resolve(`./test/fixtures/accounts.csv`),
      json2csv.parse(accounts)
    )
    fs.writeFileSync(
      path.resolve(`./test/fixtures/committees.csv`),
      json2csv.parse(committees)
    )
  } catch (error) {
    console.error(error)
  }
})()
