// @ts-check

/* eslint-disable camelcase */

exports.shorthands = undefined

/**
 *
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
exports.up = (pgm) => {
  pgm.renameTable('contributions', 'transactions')
  pgm.renameColumn('transactions', 'trans_id', 'source_transaction_id')
  pgm.renameColumn(
    'transactions',
    'committee_sboe_id',
    'canon_committee_sboe_id'
  )
  pgm.renameColumn(
    'transactions',
    'original_contributor_id',
    'original_account_id'
  )
  pgm.renameColumn(
    'transactions',
    'original_committee_id',
    'original_committee_sboe_id'
  )

  pgm.createView(
    'contributions',
    {},
    `select * from transactions where transaction_category = 'C'`
  )

  pgm.createView(
    'expenditures',
    {},
    `select * from transactions where transaction_category = 'E'`
  )

  pgm.renameColumn('committees', 'committee_zip_code', 'committee_full_zip')
  pgm.renameColumn(
    'committees',
    'asst_treasurer_email_name',
    'asst_treasurer_email'
  )

  pgm.renameTable('contributors', 'accounts')
  pgm.renameColumn('accounts', 'id', 'account_id')
  pgm.renameColumn('accounts', 'zipcode', 'zip_code')
  pgm.addColumns('accounts', {
    is_donor: { type: 'boolean', notNull: false },
    is_vendor: { type: 'boolean', notNull: false },
    is_person: { type: 'boolean', notNull: false },
    is_organization: { type: 'boolean', notNull: false },
  })

  pgm.createView(
    'contributors',
    {},
    `select * from accounts where (
        is_donor is null AND
        is_vendor is null AND
        is_person is null AND
        is_organization is null)
        OR is_donor = true` // TODO: change this so that only is_donor condition is true
    // checks for nulls in all columns because currently we do not have any of the records categorized
  )

  pgm.createView('vendors', {}, `select * from accounts where is_vendor = TRUE`)

  pgm.createView('people', {}, `select * from accounts where is_person = TRUE`)

  pgm.createView(
    'organizations',
    {},
    `select * from accounts where is_organization = TRUE`
  )
}

/**
 *
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
exports.down = (pgm) => {}
