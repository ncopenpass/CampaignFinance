//@ts-check
const { getClient } = require('../db')
const format = require('pg-format')

const SUPPORTED_CANDIDATE_SORT_FIELDS = [
  'candidate_full_name',
  '-candidate_full_name',
  'first_last_sml',
  '-first_last_sml',
]
const SUPPORTED_CONTRIBUTOR_SORT_FIELDS = ['sml', '-sml', 'name', '-name']

const SUPPORTED_COMMITTEE_SORT_FIELDS = ['committee_name', '-committee_name']

/**
 * @typedef {Object} SearchResult
 * @property {Array<any>} data
 * @property {number} count
 */

/**
 * @param {string} name
 * @param {string|number} offset
 * @param {string|number} limit
 * @param {string|number} trigramLimit
 * @param {string} sort
 * @param {string} nameFilter
 * @param {string} professionFilter
 * @param {string} cityStateFilter
 * @returns {Promise<SearchResult>}
 * @throws an error if the pg query or connection fails
 */
const searchContributors = async (
  name,
  offset = 0,
  limit = 50,
  trigramLimit = 0.6,
  sort = 'sml',
  nameFilter,
  professionFilter,
  cityStateFilter
) => {
  let client = null
  let order = SUPPORTED_CONTRIBUTOR_SORT_FIELDS.includes(sort) ? sort : 'sml'
  order = order.startsWith('-')
    ? `${order.replace('-', '')} DESC`
    : `${order} ASC`
  const safeNameFilter = format('AND name ilike %s', `'%${nameFilter}%'`)
  const safeProfessionFilter = format(
    'AND profession ilike %s',
    `'%${professionFilter}%'`
  )
  const safeCityStateFilter = format(
    'AND (city ilike %s or state ilike %s)',
    `'%${cityStateFilter}%'`,
    `'%${cityStateFilter}%'`
  )
  try {
    const nameILike = `%${name}%`
    client = await getClient()
    await client.query('select set_limit($1)', [trigramLimit])
    // searches by full name or the first word of the name
    // because of data integrity, we can't guarantee the first split string is the first name
    const results = await client.query(
      `select *, count(*) over() as full_count, similarity(name, $1) as sml
      from contributors where 
        (name % $1
        or name ilike $4)
        ${nameFilter ? safeNameFilter : ''}
        ${professionFilter ? safeProfessionFilter : ''}
        ${cityStateFilter ? safeCityStateFilter : ''}
      order by ${order}
      limit $2 offset $3`,
      [name, limit, offset, nameILike]
    )
    return {
      data: results.rows,
      count: results.rows.length > 0 ? results.rows[0].full_count : 0,
    }
  } catch (error) {
    throw error
  } finally {
    if (client !== null) {
      client.release()
    }
  }
}

/**
 * @param {string} name
 * @param {string|number} offset
 * @param {string|number} limit
 * @param {string|number} trigramLimit
 * @param {string} sort
 * @returns {Promise<SearchResult>}
 * @throws an error if the pg query or connection fails
 */
const searchCommittees = async (
  name,
  offset = 0,
  limit = 10,
  trigramLimit = 0.6,
  sort = 'committee_name_sml'
) => {
  let client = null
  let order = SUPPORTED_COMMITTEE_SORT_FIELDS.includes(sort)
    ? sort
    : 'committee_name_sml'
  order = order.startsWith('-')
    ? `${order.replace('-', '')} DESC`
    : `${order} ASC`

  console.log({ order })

  try {
    client = await getClient()
    await client.query('select set_limit($1)', [trigramLimit])
    const results = await client.query(
      `select *,
        similarity(committee_name, $1) as committee_name_sml,
        count(*) over() as full_count
      from committees
        where
          (committee_name % $1)
        order by ${order}
        limit $2 offset $3`,
      [name, limit, offset]
    )

    return {
      data: results.rows,
      count: results.rows.length > 0 ? results.rows[0].full_count : 0,
    }
  } catch (error) {
    throw error
  } finally {
    if (client !== null) {
      client.release()
    }
  }
}

/**
 * @param {string} name
 * @param {string|number} offset
 * @param {string|number} limit
 * @param {string|number} trigramLimit
 * @param {string} sort
 * @param {string} nameFilter
 * @param {string} partyFilter
 * @param {string} contestFilter
 * @returns {Promise<SearchResult>}
 * @throws an error if the pg query or connection fails
 */
const searchCandidates = async (
  name,
  offset = 0,
  limit = 50,
  trigramLimit = 0.6,
  sort = 'first_last_sml',
  nameFilter,
  partyFilter,
  contestFilter
) => {
  let client = null
  let order = SUPPORTED_CANDIDATE_SORT_FIELDS.includes(sort)
    ? sort
    : 'first_last_sml'
  order = order.startsWith('-')
    ? `${order.replace('-', '')} DESC`
    : `${order} ASC`
  const nameILike = `%${name}%`
  const safePartyFilter = format('AND party ilike %s', `'%${partyFilter}%'`)
  const safeNameFilter = format(
    'AND candidate_full_name ilike %s',
    `'%${nameFilter}%'`
  )
  const safeContestFilter = format(
    'AND (juris ilike %s or office ilike %s)',
    `'%${contestFilter}%'`,
    `'%${contestFilter}%'`
  )

  try {
    client = await getClient()
    await client.query('select set_limit($1)', [trigramLimit])
    const results = await client.query(
      `select *,
        similarity(candidate_last_name, $1) as last_name_sml,
        similarity(candidate_first_last_name, $1) as first_last_sml,
        similarity(candidate_full_name, $1) as full_name_sml,
        count(*) over() as full_count
      from committees
        where
          (candidate_full_name % $1
          OR candidate_last_name % $1
          OR candidate_full_name ilike $4)
          ${partyFilter ? safePartyFilter : ''}
          ${nameFilter ? safeNameFilter : ''}
          ${contestFilter ? safeContestFilter : ''}
        order by ${order}
        limit $2 offset $3`,
      [name, limit, offset, nameILike]
    )

    return {
      data: results.rows,
      count: results.rows.length > 0 ? results.rows[0].full_count : 0,
    }
  } catch (error) {
    throw error
  } finally {
    if (client !== null) {
      client.release()
    }
  }
}

module.exports = {
  searchContributors,
  searchCandidates,
  searchCommittees,
}
