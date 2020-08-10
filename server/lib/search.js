//@ts-check
const { getClient } = require('../db')

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
 * @returns {Promise<SearchResult>}
 * @throws an error if the pg query or connection fails
 */
const searchContributors = async (
  name,
  offset = 0,
  limit = 50,
  trigramLimit = 0.6
) => {
  let client = null
  try {
    client = await getClient()
    await client.query('select set_limit($1)', [trigramLimit])
    const results = await client.query(
      `select *, count(*) over() as full_count, similarity(name, $1) as sml
      from contributors where name % $1
      order by sml
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
 * @returns {Promise<SearchResult>}
 * @throws an error if the pg query or connection fails
 */
const searchCommittees = async (
  name,
  offset = 0,
  limit = 50,
  trigramLimit = 0.6
) => {
  let client = null
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
          candidate_full_name % $1 OR candidate_last_name % $1
        order by first_last_sml
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

module.exports = {
  searchContributors,
  searchCommittees,
}
