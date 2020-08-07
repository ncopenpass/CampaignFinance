const _ = require('lodash')
const pg = require('pg')
const { Pool } = pg
require('dotenv').config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    !process.env.DB_IGNORE_SSL && process.env.NODE_ENV === 'production'
      ? {
          rejectUnauthorized: false,
        }
      : undefined,
})
const query = (text, params) => pool.query(text, params)
/**
 * @returns {Promise<pg.PoolClient>}
 */
const getClient = () => pool.connect()

const insertContributor = async ({
  name,
  street_line_1,
  street_line_2,
  city,
  state,
  zip_code,
  profession,
  employer_name,
}) => {
  return query(
    `insert into contributors (id, name, street_line_1, street_line_2, city, state, zip_code, profession, employer_name)
    values (DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8) returning id`,
    [
      name,
      street_line_1,
      street_line_2,
      city,
      state,
      zip_code,
      profession,
      employer_name,
    ]
  )
}

const insertContributions = (contributions) => {
  // ($1, $2, $3, etc), ($4, $5, $6, etc), (etc)
  const values = _.flatten(
    contributions.map((contribution) => [
      contribution.source_contribution_id,
      contribution.contributor_id,
      contribution.transaction_type,
      contribution.committee_name,
      contribution.committee_sboe_id,
      contribution.committee_street_1,
      contribution.committee_street_2,
      contribution.committee_city,
      contribution.committee_state,
      contribution.committee_zip_code,
      contribution.report_name,
      contribution.date_occurred,
      contribution.account_code,
      contribution.amount,
      contribution.form_of_payment,
      contribution.purpose,
      contribution.candidate_or_referendum_name,
      contribution.declaration,
    ])
  )
  // take values, and generate value str. Divide by 18
  const valueStr = values
    .reduce((acc, val, idx) => {
      const value = `${acc}\$${idx + 1}`
      if (idx === 0) {
        return `(${value},`
      } else if ((idx + 1) % 18 === 0) {
        return `${value}), (`
      } else {
        return `${value},`
      }
    }, '')
    .slice(0, -3)
  return query(
    `insert into contributions (source_contribution_id, contributor_id, transaction_type, committee_name, committee_sboe_id,
      committee_street_1, committee_street_2, committee_city, committee_state, committee_zip_code,
      report_name, date_occurred, account_code, amount, form_of_payment, purpose,
      candidate_or_referendum_name, declaration)
    values ${valueStr}`,
    values
  )
}

module.exports = {
  query,
  getClient,
  insertContributor,
  insertContributions,
}
