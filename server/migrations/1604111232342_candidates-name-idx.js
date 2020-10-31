/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.sql(
    `alter table committees add column if not exists candidate_full_name text`
  )
  pgm.sql(
    `alter table committees add column if not exists candidate_first_last_name text`
  )
  // Also runs in etl script
  pgm.sql(
    `create index if not exists candidate_name_trgm_idx on committees using gin (candidate_last_name gin_trgm_ops, candidate_first_last_name gin_trgm_ops, candidate_full_name gin_trgm_ops)`
  )
}

exports.down = (pgm) => {
  pgm.sql(`alter table committees drop column if exists candidate_full_name`)
  pgm.sql(
    `alter table committees drop column if exists candidate_first_last_name`
  )
  pgm.sql(`drop index if exists candidate_name_trgm_idx`)
}
