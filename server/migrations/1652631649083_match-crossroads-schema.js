// @ts-check
/* eslint-disable camelcase */

exports.shorthands = undefined

/**
 *
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
exports.up = (pgm) => {
  pgm.dropColumns(
    'transactions',
    [
      'committee_street_1',
      'committee_street_2',
      'committee_city',
      'committee_zip_code',
      'committee_state',
      'original_account_id',
    ],
    { cascade: true }
  )

  pgm.dropColumns('committees', [
    'comm_id',
    'treasurer_first_name',
    'treasurer_middle_name',
    'treasurer_last_name',
    'treasurer_email',
    'asst_treasurer_first_name',
    'asst_treasurer_middle_name',
    'asst_treasurer_last_name',
    'asst_treasurer_email',
    'treasurer_city',
    'treasurer_street_1',
    'treasurer_street_2',
    'treasurer_state',
    'treasurer_full_zip',
    'treasurer_id',
    'asst_treasurer_id',
  ])

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
}

/**
 *
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
exports.down = (pgm) => {}
