/* eslint-disable camelcase */

exports.shorthands = undefined

/**
 *
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
exports.up = (pgm) => {
  pgm.sql(
    `CREATE INDEX IF NOT EXISTS lower_sboe_id ON contributions ((lower(committee_sboe_id)));`
  )
  pgm.sql(
    `CREATE INDEX IF NOT EXISTS contributor_name_trgm_idx ON contributors USING gist (name gist_trgm_ops);`
  )
}

/**
 *
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
exports.down = (pgm) => {
  pgm.sql(`DROP INDEX IF EXISTS lower_sboe_id;`)
  pgm.sql(`DROP INDEX IF EXISTS contributor_name_trgm_idx;`)
}
