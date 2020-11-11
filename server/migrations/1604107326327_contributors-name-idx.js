/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.sql(
    `create index contributor_name_trgm_idx on contributors using gist (name gist_trgm_ops)`
  )
}

exports.down = (pgm) => {
  pgm.sql(`drop index if exists contributor_name_trgm_idx`)
}
