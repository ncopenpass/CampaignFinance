#! /usr/local/env node

const fs = require('fs')
const path = require('path')
const db = require('../db')
const json2csv = require('json2csv')

// array: [1, 2, 3] => string: '1, 2, 3'
const toSQLInQueryArgs = (args, el) => `${args}, ${el}`

;(async () => {
  try {
    // Get random list of transactions
    const transactions = (
      await db.query('select * from transactions limit 100 offset random()')
    ).rows

    // Get contributor_id's from result
    const contributorIds = transactions
      .map((transaction) => parseInt(transaction.contributor_id))
      .reduce(toSQLInQueryArgs)

    const committeeIds = transactions
      .map((transaction) => transaction.canon_committee_sboe_id)
      .map((id) => `'${id}'`)
      .reduce(toSQLInQueryArgs)

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
      json2csv.parse(transactions, { emptyString: null })
    )
    fs.writeFileSync(
      path.resolve(`./test/fixtures/accounts.csv`),
      json2csv.parse(accounts, { emptyString: null })
    )
    fs.writeFileSync(
      path.resolve(`./test/fixtures/committees.csv`),
      json2csv.parse(committees, { emptyString: null })
    )
  } catch (error) {
    console.error(error)
  }
})()
