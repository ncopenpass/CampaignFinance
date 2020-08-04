/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.createTable('committees', {
    sboe_id: { type: 'TEXT', primaryKey: true },
    current_status: { type: 'TEXT' },
    committee_name: { type: 'TEXT' },
    committee_type: { type: 'TEXT' },
    committee_street_1: { type: 'TEXT' },
    committee_street_2: { type: 'TEXT' },
    committee_city: { type: 'TEXT' },
    committee_state: { type: 'TEXT' },
    committee_full_zip: { type: 'TEXT' },
    candidate_first_name: { type: 'TEXT' },
    candidate_middle_name: { type: 'TEXT' },
    candidate_last_name: { type: 'TEXT' },
    treasurer_first_name: { type: 'TEXT' },
    treasurer_middle_name: { type: 'TEXT' },
    treasurer_last_name: { type: 'TEXT' },
    treasurer_email: { type: 'TEXT' },
    asst_treasurer_first_name: { type: 'TEXT' },
    asst_treasurer_middle_name: { type: 'TEXT' },
    asst_treasurer_last_name: { type: 'TEXT' },
    asst_treasurer_email: { type: 'TEXT' },
    treasurer_street_1: { type: 'TEXT' },
    treasurer_street_2: { type: 'TEXT' },
    treasurer_city: { type: 'TEXT' },
    treasurer_state: { type: 'TEXT' },
    treasurer_full_zip: { type: 'TEXT' },
    party: { type: 'TEXT' },
    office: { type: 'TEXT' },
    juris: { type: 'TEXT' },
  })
}

exports.down = (pgm) => {
  pgm.dropTable('committees', { ifExists: true })
}
