/* eslint-disable camelcase */

exports.shorthands = undefined

/**
 *
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
exports.up = (pgm) => {
  pgm.sql(
    `CREATE INDEX IF NOT EXISTS contributions_lower_sboe_id ON contributions ((lower(committee_sboe_id)));`
  )
  pgm.sql(
    `CREATE INDEX IF NOT EXISTS contributor_name_trgm_idx ON contributors USING gist (name gist_trgm_ops);`
  )
  pgm.sql(
    `CREATE INDEX IF NOT EXISTS committees_sboe_id on committees (sboe_id);`
  )
  pgm.sql(
    `CREATE INDEX IF NOT EXISTS contributions_sboe_id on contributions (committee_sboe_id);`
  )
  pgm.sql(
    `CREATE INDEX IF NOT EXISTS contributions_contributor_id on contributions (contributor_id);`
  )
}

/**
 *
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
exports.down = (pgm) => {
  pgm.sql(`DROP INDEX IF EXISTS contributions_lower_sboe_id;`)
  pgm.sql(`DROP INDEX IF EXISTS contributor_name_trgm_idx;`)
  pgm.sql(`DROP INDEX IF EXISTS committees_sboe_id;`)
  pgm.sql(`DROP INDEX IF EXISTS contributions_sboe_id;`)
  pgm.sql(`DROP INDEX IF EXISTS contributions_contributor_id;`)
}
