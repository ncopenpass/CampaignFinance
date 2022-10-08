import { Response } from 'express'
import * as db from '../db'
import format from 'pg-format'
import { apiReprContributorContributions, apiReprExpenditure } from './repr'

const SUPPORTED_CANDIDATE_CONTRIBUTION_SORT_FIELDS = [
  'name',
  '-name',
  'amount',
  '-amount',
  'date_occurred',
  '-date_occurred',
]

const SUPPORTED_EXPENDITURES_SORT_FIELDS = [
  'amount',
  '-amount',
  'date_occurred',
  '-date_occurred',
]

type CandidateSummary = {
  sum: number
  avg: number
  max: number
  count: number
}

export const getCandidateSummary = async ({
  ncsbeID,
  date_occurred_gte: date_occurred_gteFilter = null,
  date_occurred_lte: date_occurred_lteFilter = null,
}: {
  ncsbeID: string
  date_occurred_gte: string | null
  date_occurred_lte: string | null
}): Promise<CandidateSummary> => {
  const safeDateOccurredGteFilter = date_occurred_gteFilter
    ? format('AND date_occurred >= CAST(%L as DATE)', date_occurred_gteFilter)
    : ''
  const safeDateOccurredLteFilter = date_occurred_lteFilter
    ? format('AND date_occurred <= CAST(%L as DATE)', date_occurred_lteFilter)
    : ''

  // Post MVP we should probably find a way to speed this up.
  console.time('getCandidateSummary')
  // TODO: fix aggregated individual contribution logic
  const summary = await db.query(
    `
    with aggregated_contributions as (
      select count(*)    as aggregated_contributions_count,
             sum(amount) as aggregated_contributions_sum
      from contributions
      where contributor_id IS NULl
        and canon_committee_sboe_id = $1
  )
  select sum(amount),
         avg(amount),
         max(amount),
         count(*)::int,
         (select aggregated_contributions_count from aggregated_contributions limit 1) as aggregated_contributions_count,
         (select aggregated_contributions_sum from aggregated_contributions limit 1)   as aggregated_contributions_sum
  from contributions
  where (
    canon_committee_sboe_id = $1 
    ${safeDateOccurredGteFilter}
    ${safeDateOccurredLteFilter}
    )`,
    [ncsbeID]
  )
  console.timeEnd('getCandidateSummary')
  return summary.rows.length > 0 ? summary.rows[0] : {}
}

type CommitteeSummary = {
  sum: number
  avg: number
  max: number
  count: number
}

export const getCommitteeSummary = async ({
  ncsbeID,
  date_occurred_gte: date_occurred_gteFilter,
  date_occurred_lte: date_occurred_lteFilter,
}: {
  ncsbeID: string
  date_occurred_gte?: string
  date_occurred_lte?: string
}): Promise<CommitteeSummary> => {
  const safeDateOccurredGteFilter = date_occurred_gteFilter
    ? format('AND date_occurred >= CAST(%L as DATE)', date_occurred_gteFilter)
    : ''
  const safeDateOccurredLteFilter = date_occurred_lteFilter
    ? format('AND date_occurred <= CAST(%L as DATE)', date_occurred_lteFilter)
    : ''

  // Post MVP we should probably find a way to speed this up.
  console.time('getCommitteeSummary')
  const summary = await db.query(
    `
    with aggregated_contributions as (
      select count(*)    as aggregated_contributions_count,
             sum(amount) as aggregated_contributions_sum
      from contributions
      where contributor_id IS NULl
        and canon_committee_sboe_id = $1 
  )
  select sum(amount),
         avg(amount),
         max(amount),
         count(*)::int,
         (select aggregated_contributions_count from aggregated_contributions limit 1) as aggregated_contributions_count,
         (select aggregated_contributions_sum from aggregated_contributions limit 1)   as aggregated_contributions_sum
  from contributions
  where (
    canon_committee_sboe_id = $1 
    ${safeDateOccurredGteFilter}
    ${safeDateOccurredLteFilter}
    )`,
    [ncsbeID]
  )
  console.timeEnd('getCommitteeSummary')
  return summary.rows.length > 0 ? summary.rows[0] : {}
}

export const getCandidateContributions = async ({
  ncsbeID,
  limit = 50,
  offset = 0,
  sortBy = '',
  name: nameFilter = null,
  transaction_type: transaction_typeFilter = null,
  amount: amountFilter = null,
  amount_gte: amount_gteFilter = null,
  amount_lte: amount_lteFilter = null,
  form_of_payment: form_of_paymentFilter = null,
  date_occurred_gte: date_occurred_gteFilter = null,
  date_occurred_lte: date_occurred_lteFilter = null,
  year = null,
}: {
  ncsbeID: string
  limit: Number
  offset: Number
  sortBy: string
  name: string | null
  transaction_type: string | null
  amount: number | null
  amount_gte: Number | null
  amount_lte: Number | null
  form_of_payment: string | null
  date_occurred_gte: string | null
  date_occurred_lte: string | null
  year: string | null
}) => {
  let order = SUPPORTED_CANDIDATE_CONTRIBUTION_SORT_FIELDS.includes(sortBy)
    ? sortBy
    : ''
  order = order.startsWith('-')
    ? `${order.replace('-', '')} DESC`
    : `${order} ASC`

  const safeNameFilter = nameFilter
    ? format('AND upper(name) ilike %s', `'%${nameFilter.toUpperCase()}%'`)
    : ''
  const safeTransactionTypeFilter = transaction_typeFilter
    ? format(
        'AND upper(transaction_type) = %L',
        transaction_typeFilter.toUpperCase()
      )
    : ''
  const safeAmountFilter = amountFilter
    ? format('AND amount = %L', amountFilter)
    : ''
  const safeFormOfPaymentFilter = form_of_paymentFilter
    ? format(
        'AND upper(form_of_payment) = %L',
        form_of_paymentFilter.toUpperCase()
      )
    : ''
  const safeDateOccurredGteFilter = date_occurred_gteFilter
    ? format('AND date_occurred >= CAST(%L as DATE)', date_occurred_gteFilter)
    : ''
  const safeDateOccurredLteFilter = date_occurred_lteFilter
    ? format('AND date_occurred <= CAST(%L as DATE)', date_occurred_lteFilter)
    : ''
  const yearFilter = year
    ? format('AND EXTRACT(YEAR FROM CAST(date_occurred as DATE)) = %L', year)
    : ''
  const safeAmountGteFilter = amount_gteFilter
    ? format('AND amount >= %L', amount_gteFilter)
    : ''
  const safeAmountLteFilter = amount_lteFilter
    ? format('AND amount <= %L', amount_lteFilter)
    : ''

  console.time('getCandidateContributions - query')
  const result = await db.query(
    `select
       count(*) over () as full_count,
       contributor_id,
       transaction_type,
       canon_committee_sboe_id,
       report_name,
       date_occurred,
       account_code,
       amount,
       form_of_payment,
       purpose,
       candidate_referendum_name,
       declaration,
       name,
       city,
       state,
       zip_code,
       profession,
       employer_name
       from contributions
              join contributors c on contributions.contributor_id = c.account_id
      where (
        lower(contributions.canon_committee_sboe_id) = lower($1)
        ${safeNameFilter}
        ${safeTransactionTypeFilter}
        ${safeAmountFilter}
        ${safeFormOfPaymentFilter}
        ${safeDateOccurredGteFilter}
        ${safeDateOccurredLteFilter}
        ${yearFilter}
        ${safeAmountGteFilter}
        ${safeAmountLteFilter}
      )
      ${sortBy ? `order by ${order}` : ''}
      limit $2
      offset $3`,
    [ncsbeID, limit, offset]
  )
  console.timeEnd('getCandidateContributions - query')
  return result
}

export const getCommitteeContributions = async ({
  ncsbeID,
  limit = 50,
  offset = 0,
  sortBy = '',
  name: nameFilter,
  transaction_type: transaction_typeFilter,
  amount: amountFilter,
  form_of_payment: form_of_paymentFilter,
  date_occurred_gte: date_occurred_gteFilter,
  date_occurred_lte: date_occurred_lteFilter,
  year,
}: {
  ncsbeID: string
  limit: Number
  offset: Number
  sortBy: string
  name?: string
  transaction_type?: string
  amount?: number
  form_of_payment?: string
  date_occurred_gte?: string
  date_occurred_lte?: string
  year?: string
}) => {
  let order = SUPPORTED_CANDIDATE_CONTRIBUTION_SORT_FIELDS.includes(sortBy)
    ? sortBy
    : ''
  order = order.startsWith('-')
    ? `${order.replace('-', '')} DESC`
    : `${order} ASC`

  const safeNameFilter = nameFilter
    ? format('AND upper(name) ilike %s', `'%${nameFilter.toUpperCase()}%'`)
    : ''
  const safeTransactionTypeFilter = transaction_typeFilter
    ? format(
        'AND upper(transaction_type) = %L',
        transaction_typeFilter.toUpperCase()
      )
    : ''
  const safeAmountFilter = amountFilter
    ? format('AND amount = %L', amountFilter)
    : ''
  const safeFormOfPaymentFilter = form_of_paymentFilter
    ? format(
        'AND upper(form_of_payment) = %L',
        form_of_paymentFilter.toUpperCase()
      )
    : ''
  const safeDateOccurredGteFilter = date_occurred_gteFilter
    ? format('AND date_occurred >= CAST(%L as DATE)', date_occurred_gteFilter)
    : ''
  const safeDateOccurredLteFilter = date_occurred_lteFilter
    ? format('AND date_occurred <= CAST(%L as DATE)', date_occurred_lteFilter)
    : ''
  const yearFilter = year
    ? format('AND EXTRACT(YEAR FROM CAST(date_occurred as DATE)) = %L', year)
    : ''

  console.time('getCommitteeContributions - query')
  const result = await db.query(
    `select
       count(*) over () as full_count,
       contributor_id,
       transaction_type,
       canon_committee_sboe_id,
       report_name,
       date_occurred,
       account_code,
       amount,
       form_of_payment,
       purpose,
       declaration,
       account_id,
       name,
       city,
       state,
       zip_code,
       profession,
       employer_name
       from contributions
              join contributors c on contributions.contributor_id = c.account_id
      where (
        lower(contributions.canon_committee_sboe_id) = lower($1)
        ${safeNameFilter}
        ${safeTransactionTypeFilter}
        ${safeAmountFilter}
        ${safeFormOfPaymentFilter}
        ${safeDateOccurredGteFilter}
        ${safeDateOccurredLteFilter}
        ${yearFilter}
      )
      ${sortBy ? `order by ${order}` : ''}
      limit $2
      offset $3`,
    [ncsbeID, limit, offset]
  )
  console.timeEnd('getCommitteeContributions - query')
  return result
}

export const getCandidateContributionsForDownload = ({
  ncsbeID,
  date_occurred_gte: date_occurred_gteFilter,
  date_occurred_lte: date_occurred_lteFilter,
  year = null,
  res,
}: {
  ncsbeID: string
  date_occurred_gte?: string
  date_occurred_lte?: string
  year: string | null
  res: Response
}) => {
  const safeDateOccurredGteFilter = date_occurred_gteFilter
    ? format('AND date_occurred >= CAST(%L as DATE)', date_occurred_gteFilter)
    : ''
  const safeDateOccurredLteFilter = date_occurred_lteFilter
    ? format('AND date_occurred <= CAST(%L as DATE)', date_occurred_lteFilter)
    : ''
  const yearFilter = year
    ? format('AND EXTRACT(YEAR FROM CAST(date_occurred as DATE)) = %L', year)
    : ''
  return db.streamQueryToCSV(
    res,
    `select 
       count(*) over () as full_count,
       contributor_id,
       transaction_type,
       canon_committee_sboe_id,
       report_name,
       date_occurred,
       account_code,
       amount,
       form_of_payment,
       purpose,
       candidate_referendum_name,
       declaration,
       coalesce(name, 'Aggregated Individual Contribution') as name,
       city,
       state,
       zip_code,
       profession,
       employer_name
       from contributions
              left outer join contributors c on contributions.contributor_id = c.account_id
      where (
        lower(contributions.canon_committee_sboe_id) = lower($1)
        ${safeDateOccurredGteFilter}
        ${safeDateOccurredLteFilter}
        ${yearFilter}
        )
      `,
    [ncsbeID],
    apiReprContributorContributions
  )
}

export const getCommitteeContributionsForDownload = ({
  ncsbeID,
  date_occurred_gte: date_occurred_gteFilter,
  date_occurred_lte: date_occurred_lteFilter,
  year,
  res,
}: {
  ncsbeID: string
  date_occurred_gte?: string
  date_occurred_lte?: string
  year?: string
  res: Response
}) => {
  const safeDateOccurredGteFilter = date_occurred_gteFilter
    ? format('AND date_occurred >= CAST(%L as DATE)', date_occurred_gteFilter)
    : ''
  const safeDateOccurredLteFilter = date_occurred_lteFilter
    ? format('AND date_occurred <= CAST(%L as DATE)', date_occurred_lteFilter)
    : ''
  const yearFilter = year
    ? format('AND EXTRACT(YEAR FROM CAST(date_occurred as DATE)) = %L', year)
    : ''
  return db.streamQueryToCSV(
    res,
    `select count(*) over () as full_count,
       contributor_id,
       transaction_type,
       canon_committee_sboe_id,
       report_name,
       date_occurred,
       account_code,
       amount,
       form_of_payment,
       purpose,
       declaration,
       account_id,
       coalesce(name, 'Aggregated Individual Contribution') as name,
       city,
       state,
       zip_code,
       profession,
       employer_name
       from contributions
              left outer join contributors c on contributions.contributor_id = c.account_id
      where (
        lower(contributions.canon_committee_sboe_id) = lower($1)
        ${safeDateOccurredGteFilter}
        ${safeDateOccurredLteFilter}
        ${yearFilter}
        )`,
    [ncsbeID],
    apiReprContributorContributions
  )
}

export const getExpendituresForDownload = ({
  ncsbeID,
  date_occurred_gte: date_occurred_gteFilter,
  date_occurred_lte: date_occurred_lteFilter,
  year,
  res,
}: {
  ncsbeID: string
  date_occurred_gte?: string
  date_occurred_lte?: string
  year?: string
  res: Response
}) => {
  const safeDateOccurredGteFilter = date_occurred_gteFilter
    ? format('AND date_occurred >= CAST(%L as DATE)', date_occurred_gteFilter)
    : ''
  const safeDateOccurredLteFilter = date_occurred_lteFilter
    ? format('AND date_occurred <= CAST(%L as DATE)', date_occurred_lteFilter)
    : ''
  const yearFilter = year
    ? format('AND EXTRACT(YEAR FROM CAST(date_occurred as DATE)) = %L', year)
    : ''
  return db.streamQueryToCSV(
    res,
    `select count(*) over () as full_count,
    e.date_occurred,
    e.form_of_payment,
    e.transaction_type,
    e.purpose,
    e.amount,
    v.name
    from expenditures e join accounts v on e.contributor_id = v.account_id
    where (
      lower(e.original_committee_sboe_id) = lower($1)
        ${safeDateOccurredGteFilter}
        ${safeDateOccurredLteFilter}
        ${yearFilter}
  )`,
    [ncsbeID],
    apiReprExpenditure
  )
}

export const getCandidate = async (ncsbeID: string) => {
  const result = await db.query(
    `select * from committees
      where upper(committees.sboe_id) = upper($1)`,
    [ncsbeID]
  )
  return result.rows.length > 0 ? result.rows[0] : null
}

export const getCommittee = async (ncsbeID: string) => {
  const result = await db.query(
    `select * from committees
      where upper(committees.sboe_id) = upper($1)`,
    [ncsbeID]
  )
  return result.rows.length > 0 ? result.rows[0] : null
}

export const getContributorContributions = ({
  contributorId,
  limit,
  offset,
  sortBy = '',
  date_occurred_gte: date_occurred_gteFilter,
  date_occurred_lte: date_occurred_lteFilter,
  year,
}: {
  contributorId: string
  limit?: Number
  offset?: Number
  sortBy?: string
  date_occurred_gte?: string
  date_occurred_lte?: string
  year?: string
}) => {
  let order = SUPPORTED_CANDIDATE_CONTRIBUTION_SORT_FIELDS.includes(sortBy)
    ? sortBy
    : ''
  order = order?.startsWith('-')
    ? `${order.replace('-', '')} DESC`
    : `${order} ASC`
  const safeDateOccurredGteFilter = date_occurred_gteFilter
    ? format('AND date_occurred >= CAST(%L as DATE)', date_occurred_gteFilter)
    : ''
  const safeDateOccurredLteFilter = date_occurred_lteFilter
    ? format('AND date_occurred <= CAST(%L as DATE)', date_occurred_lteFilter)
    : ''
  const yearFilter = year
    ? format('AND EXTRACT(YEAR FROM CAST(date_occurred as DATE)) = %L', year)
    : ''

  return db.query(
    `select *, count(*) over () as full_count,
    (select sum(amount) from contributions c where contributor_id = $1
      and c.canon_committee_sboe_id = contributions.canon_committee_sboe_id) as total_contributions_to_committee
    from contributions
    join committees on committees.sboe_id = contributions.canon_committee_sboe_id
    where contributor_id = $1
      ${safeDateOccurredGteFilter}
      ${safeDateOccurredLteFilter}
      ${yearFilter}
      ${sortBy ? `order by ${order}` : ''}
    limit $2
    offset $3
    `,
    [contributorId, limit, offset]
  )
}

export const getContributor = ({ contributorId }: { contributorId: string }) =>
  db.query(`select * from contributors where account_id = $1`, [contributorId])

export const getExpenditures = async ({
  ncsbeID,
  limit = 50,
  offset = 0,
  sortBy = '',
  date_occurred_gte: date_occurred_gteFilter,
  date_occurred_lte: date_occurred_lteFilter,
  year,
}: {
  ncsbeID: string
  limit: Number
  offset: Number
  sortBy?: string
  date_occurred_gte?: string
  date_occurred_lte?: string
  year?: string
}) => {
  let order = SUPPORTED_EXPENDITURES_SORT_FIELDS.includes(sortBy) ? sortBy : ''
  order = order.startsWith('-')
    ? `${order.replace('-', '')} DESC`
    : `${order} ASC`

  const safeDateOccurredGteFilter = date_occurred_gteFilter
    ? format('AND date_occurred >= CAST(%L as DATE)', date_occurred_gteFilter)
    : ''
  const safeDateOccurredLteFilter = date_occurred_lteFilter
    ? format('AND date_occurred <= CAST(%L as DATE)', date_occurred_lteFilter)
    : ''
  const yearFilter = year
    ? format('AND EXTRACT(YEAR FROM CAST(date_occurred as DATE)) = %L', year)
    : ''
  console.time('getExpenditures - query')
  const result = await db.query(
    `select count(*) over () as full_count,
      e.date_occurred,
      e.form_of_payment,
      e.transaction_type,
      e.purpose,
      e.amount,
      v.name
    from expenditures e join accounts v on e.contributor_id = v.account_id
    where (
      lower(e.original_committee_sboe_id) = lower($1)
      ${safeDateOccurredGteFilter}
      ${safeDateOccurredLteFilter}
      ${yearFilter}
    )
    ${sortBy ? `order by e.${order}` : ''}
    limit $2
    offset $3`,
    [ncsbeID, limit, offset]
  )
  console.timeEnd('getExpenditures - query')
  return result
}

export const getCandidateContributionYears = async ({
  ncsbeID,
}: {
  ncsbeID: string
}): Promise<string[]> => {
  const result = await db.query(
    `SELECT distinct(date_part('year', date_occurred))
  FROM transactions
  WHERE date_occurred IS NOT NULL
    AND canon_committee_sboe_id = $1
    order by date_part desc`,
    [ncsbeID]
  )
  const years = result.rows.map((row) => row.date_part)
  return years
}

export const getContributorContributionYears = async ({
  ncsbeID,
}: {
  ncsbeID: string
}): Promise<string[]> => {
  const result = await db.query(
    `SELECT distinct(date_part('year', date_occurred))
  FROM transactions
  WHERE date_occurred IS NOT NULL
    AND contributor_id = $1
    order by date_part desc`,
    [ncsbeID]
  )
  const years = result.rows.map((row) => row.date_part)
  return years
}
