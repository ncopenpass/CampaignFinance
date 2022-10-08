import { getClient } from '../db'
import format, { string } from 'pg-format'

const SUPPORTED_CANDIDATE_SORT_FIELDS = [
  'candidate_full_name',
  '-candidate_full_name',
  'first_last_sml',
  '-first_last_sml',
]
const SUPPORTED_CONTRIBUTOR_SORT_FIELDS = ['sml', '-sml', 'name', '-name']

const SUPPORTED_COMMITTEE_SORT_FIELDS = [
  'committee_name_sml',
  '-committee_name_sml',
  'committee_name',
  '-committee_name',
]

type SearchResult = {
  data: any[]
  count: Number
}

export const searchContributors = async (
  name: string,
  offset = 0,
  limit = 50,
  trigramLimit = 0.6,
  sort = 'sml',
  nameFilter?: string,
  professionFilter?: string,
  cityStateFilter?: string
): Promise<SearchResult> => {
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

export const searchCommittees = async ({
  name,
  offset = 0,
  limit = 10,
  trigramLimit = 0.6,
  sort = '',
  partyFilter = '',
  nameFilter = '',
  contestFilter = '',
}: {
  name: string
  offset: number
  limit: number
  trigramLimit: number
  sort: string
  partyFilter: string
  nameFilter: string
  contestFilter: string
}): Promise<SearchResult> => {
  let client = null
  // default order by to nothing because postgres default ordering of ilike
  // works better than ordering by committee_name_sml
  let order = SUPPORTED_COMMITTEE_SORT_FIELDS.includes(sort) ? sort : ''
  order =
    order === ''
      ? ''
      : order.startsWith('-')
      ? `order by ${order.replace('-', '')} DESC`
      : `order by ${order} ASC`
  const safePartyFilter = format('AND party ilike %s', `'%${partyFilter}%'`)
  const safeNameFilter = format(
    'AND committee_name ilike %s',
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
        similarity(committee_name, $1) as committee_name_sml,
        count(*) over() as full_count
      from committees
        where
        (
          committee_name % $1
          or committee_name ilike '%' || $1 || '%'
          or candidate_full_name % $1
          or candidate_full_name ilike '%' || $1 || '%'
        )
          ${partyFilter ? safePartyFilter : ''}
          ${nameFilter ? safeNameFilter : ''}
          ${contestFilter ? safeContestFilter : ''}
        ${order} 
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

export const searchCandidates = async (
  name: string,
  offset = 0,
  limit = 50,
  trigramLimit = 0.6,
  sort = 'first_last_sml',
  nameFilter: string,
  partyFilter: string,
  contestFilter: string
): Promise<SearchResult> => {
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
