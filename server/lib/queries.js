// @ts-check

/**
 * @typedef {Object} CandidateSummary
 * @property {Number} sum - The sum of all donations given to a candidate
 * @property {Number} avg - The avg of all donation given to a candidate
 * @property {Number} max - The largest donation given to a candidate
 * @property {Number} count - The number of donations given to a candidate
 */

/**
 *
 * @param {string} ncsbeID
 * @param {import('pg').PoolClient} client
 * @returns {Promise<CandidateSummary>}
 */
const getCandidateSummary = async (ncsbeID, client) => {
  const summary = await client.query(
    `select sum(amount), avg(amount), max(amount), count(*)::int
        from contributions
        where committee_sboe_id = $1;`,
    [ncsbeID]
  )

  return summary.rows.length > 0 ? summary.rows[0] : {}
}

module.exports = {
  getCandidateSummary,
}
