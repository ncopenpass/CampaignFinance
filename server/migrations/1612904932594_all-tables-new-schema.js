// @ts-check
/* eslint-disable camelcase */

exports.shorthands = undefined

/**
 *
 * @param {import('node-pg-migrate').MigrationBuilder}pgm
 */
exports.up = (pgm) => {
  pgm.dropTable('committees', { cascade: true })
  pgm.dropTable('contributions', { cascade: true })
  pgm.dropTable('contributors', { cascade: true })

  pgm.createTable('committees', {
    comm_id: { type: 'int' },
    sboe_id: { type: 'TEXT' },
    current_status: { type: 'TEXT' },
    committee_name: { type: 'TEXT' },
    committee_type: { type: 'TEXT' },
    committee_street_1: { type: 'TEXT' },
    committee_street_2: { type: 'TEXT' },
    committee_city: { type: 'TEXT' },
    committee_state: { type: 'TEXT' },
    committee_zip_code: { type: 'TEXT' },
    candidate_first_name: { type: 'TEXT' },
    candidate_middle_name: { type: 'TEXT' },
    candidate_last_name: { type: 'TEXT' },
    candidate_full_name: { type: 'TEXT' },
    candidate_first_last_name: { type: 'TEXT' },
    treasurer_first_name: { type: 'TEXT' },
    treasurer_middle_name: { type: 'TEXT' },
    treasurer_last_name: { type: 'TEXT' },
    treasurer_email: { type: 'TEXT' },
    asst_treasurer_first_name: { type: 'TEXT' },
    asst_treasurer_middle_name: { type: 'TEXT' },
    asst_treasurer_last_name: { type: 'TEXT' },
    asst_treasurer_email_name: { type: 'TEXT' },
    treasurer_street_1: { type: 'TEXT' },
    treasurer_street_2: { type: 'TEXT' },
    treasurer_city: { type: 'TEXT' },
    treasurer_state: { type: 'TEXT' },
    treasurer_full_zip: { type: 'TEXT' },
    treasurer_id: { type: 'TEXT' },
    asst_treasurer_id: { type: 'TEXT' },
    party: { type: 'TEXT' },
    office: { type: 'TEXT' },
    juris: { type: 'TEXT' },
  })
  pgm.createTable('contributors', {
    id: { type: 'int', primaryKey: true },
    name: { type: 'TEXT' },
    city: { type: 'TEXT' },
    state: { type: 'TEXT' },
    zipcode: { type: 'TEXT' },
    profession: { type: 'TEXT' },
    employer_name: { type: 'TEXT' },
  })
  pgm.createTable('contributions', {
    trans_id: { type: 'int' },
    contributor_id: { type: 'int', references: 'contributors(id)' },
    transaction_type: { type: 'TEXT' },
    committee_name: { type: 'TEXT' },
    committee_sboe_id: { type: 'TEXT' },
    committee_street_1: { type: 'TEXT' },
    committee_street_2: { type: 'TEXT' },
    committee_city: { type: 'TEXT' },
    committee_state: { type: 'TEXT' },
    committee_zip_code: { type: 'TEXT' },
    transaction_category: { type: 'TEXT' },
    date_occurred: { type: 'DATE' },
    amount: { type: 'REAL' },
    report_name: { type: 'TEXT' },
    account_code: { type: 'TEXT' },
    form_of_payment: { type: 'TEXT' },
    purpose: { type: 'TEXT' },
    candidate_referendum_name: { type: 'TEXT' },
    declaration: { type: 'TEXT' },
    original_committee_id: { type: 'TEXT' },
    original_contributor_id: { type: 'int' },
  })
}

exports.down = (pgm) => {}
