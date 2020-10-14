// @ts-check

const SUPPORTED_CANDIDATE_CONTRIBUTION_SORT_FIELDS = [
  'name',
  '-name',
  'amount',
  '-amount',
  'date_occurred',
  '-date_occurred',
]

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
  // Post MVP we should probably find a way to speed this up.
  // console.time("getCandidateSummary")
  const summary = await client.query(
    `select sum(amount),
       avg(amount),
       max(amount),
       count(*)::int,
       (select count(*)
        from contributions
        where contributor_id IS NULl
          and committee_sboe_id = $1) as aggregated_contributions_count,
       (select sum(amount)
        from contributions
        where contributor_id IS NULL
          and committee_sboe_id = $1) as aggregated_contributions_sum
      from contributions
      where committee_sboe_id = $1;
`,
    [ncsbeID]
  )
  // console.timeEnd("getCandidateSummary")
  return summary.rows.length > 0 ? summary.rows[0] : {}
}

/**
 *
 * @param {Object} args
 * @param {string} args.ncsbeID
 * @param {Number|string} args.limit
 * @param {Number|string} args.offset
 * @param {import('pg').PoolClient} args.client
 * @param {string} args.sortBy
 * @param {string} args.name
 * @param {string} args.transaction_type
 * @param {string} args.amount
 * @param {string} args.form_of_payment
 * @param {string} args.date_occurred_gte
 * @param {string} args.date_occurred_lte
 * @returns {Promise<import('pg').QueryResult>}
 */
const getCandidateContributions = ({
  ncsbeID,
  limit = 50,
  offset = 0,
  client,
  sortBy = null,
  name = null,
  transaction_type = null,
  amount = null,
  form_of_payment = null,
  date_occurred_gte = null,
  date_occurred_lte = null,
}) => {
  let order = SUPPORTED_CANDIDATE_CONTRIBUTION_SORT_FIELDS.includes(sortBy)
    ? sortBy
    : ''
  order = order.replace('date_occurred', 'CAST(date_occurred as DATE)')
  order = order.startsWith('-')
    ? `${order.replace('-', '')} DESC`
    : `${order} ASC`
  console.log('date_occurred_gte', date_occurred_gte)

  return client.query(
    `select count(*) over () as full_count,
       source_contribution_id,
       contributor_id,
       transaction_type,
       committee_sboe_id,
       report_name,
       date_occurred,
       account_code,
       amount,
       form_of_payment,
       purpose,
       candidate_or_referendum_name,
       declaration,
       id,
       name,
       city,
       state,
       zip_code,
       profession,
       employer_name
       from contributions
              join contributors c on contributions.contributor_id = c.id
      where (
        lower(contributions.committee_sboe_id) = lower($1)
        ${name ? `AND upper(name) ilike '%${name.toUpperCase()}%'` : ''}
        ${
          transaction_type
            ? `AND upper(transaction_type) ='${transaction_type.toUpperCase()}'`
            : ''
        }
        ${amount ? `AND amount ='${amount}'` : ''}
        ${
          form_of_payment
            ? `AND upper(form_of_payment) ='${form_of_payment.toUpperCase()}'`
            : ''
        }
        ${
          date_occurred_gte
            ? `AND CAST(date_occurred as DATE) >= CAST('${date_occurred_gte}' as DATE)`
            : ''
        }
        ${
          date_occurred_lte
            ? `AND CAST(date_occurred as DATE) <= CAST('${date_occurred_lte}' as DATE)`
            : ''
        }
      )
      ${sortBy ? `order by ${order}` : ''}
      limit $2
      offset $3`,
    [ncsbeID, limit, offset]
  )
}

/**
 * Gets all contributors and contributions
 * null contributor_id's are Aggregated Individual Contributions
 * @param {Object} args
 * @param {string} args.ncsbeID
 * @param {import('pg').PoolClient} args.client
 * @returns {Promise<import('pg').QueryResult>}
 */
const getCandidateContributionsForDownload = ({ ncsbeID, client }) => {
  return client.query(
    `select count(*) over () as full_count,
       source_contribution_id,
       contributor_id,
       transaction_type,
       committee_sboe_id,
       report_name,
       date_occurred,
       account_code,
       amount,
       form_of_payment,
       purpose,
       candidate_or_referendum_name,
       declaration,
       id,
       coalesce(name, 'Aggregated Individual Contribution') as name,
       city,
       state,
       zip_code,
       profession,
       employer_name
       from contributions
              left outer join contributors c on contributions.contributor_id = c.id
      where lower(contributions.committee_sboe_id) = lower($1)
      `,
    [ncsbeID]
  )
}

/**
 *
 * @param {string} ncsbeID
 * @param {import('pg').PoolClient} client
 * @returns {Promise<Object|null>}
 */
const getCandidate = async (ncsbeID, client) => {
  const result = await client.query(
    `select * from committees
      where upper(committees.sboe_id) = upper($1)`,
    [ncsbeID]
  )
  return result.rows.length > 0 ? result.rows[0] : null
}

module.exports = {
  getCandidateSummary,
  getCandidateContributions,
  getCandidate,
  getCandidateContributionsForDownload,
}
