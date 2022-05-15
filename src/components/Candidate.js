import React, { useEffect, useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Grid, GridContainer } from '@trussworks/react-uswds'
import NumberFormat from 'react-number-format'

import {
  useCandidate,
  useTableColumns,
  useExpenditures,
  useGetCandidateContributionYears,
} from '../hooks'
import { API_BATCH_SIZE, STATUSES } from '../constants'
import '../css/candidate.scss'
import { formatSortBy } from '../utils'

import SearchResultTable from './SearchResultTable'
import ReportError from './ReportError'
import DateRange from './DateRange'

const Candidate = () => {
  let { candidateId } = useParams()
  const [lastContributionsQuery, setLastContributionsQuery] = useState({})
  const [lastExpendituresQuery, setLastExpendituresQuery] = useState({})

  // Initialize dates to current year
  const date = new Date()
  const currentDate = date.toISOString().split('T')[0]
  const currentYear = date.getFullYear().toString()
  const [datePickerStart, setDatePickerStart] = useState(currentYear + '-01-01')
  const [datePickerEnd, setDatePickerEnd] = useState(currentDate)

  const { years, status: yearsStatus } =
    useGetCandidateContributionYears(candidateId)

  useEffect(() => {
    if (years && years.length > 0 && yearsStatus === STATUSES.Success) {
      setDatePickerStart(years[years.length - 1] + '-01-01')
      setDatePickerEnd(years[0] + '-12-31')
    }
  }, [years, yearsStatus])

  const {
    apiStatus: candidateApiStatus,
    candidate,
    contributions,
    summary,
    contributionCount,
    fetchInitialSearchData,
    fetchContributions,
  } = useCandidate()

  const {
    apiStatus: expendituresApiStatus,
    expenditures,
    expenditureCount,
    fetchExpenditures,
  } = useExpenditures()

  useEffect(() => {
    if (fetchInitialSearchData && fetchExpenditures) {
      let query = {
        candidateId,
        limit: API_BATCH_SIZE,
        offset: 0,
        sort: '-date_occurred',
        filters: [
          { date_occurred_gte: datePickerStart },
          { date_occurred_lte: datePickerEnd },
        ],
      }
      setLastContributionsQuery(query)
      fetchInitialSearchData(query)
      query = { ...query, ncsbeID: query.candidateId }
      delete query.candidateId
      setLastExpendituresQuery(query)
      fetchExpenditures(query)
    }
  }, [
    candidateId,
    fetchInitialSearchData,
    fetchExpenditures,
    datePickerStart,
    datePickerEnd,
  ])

  const getFunctionsAndQuery = useCallback(
    (type) => {
      let query, setQuery, fetchData
      if (type === 'contributions') {
        query = lastContributionsQuery
        setQuery = setLastContributionsQuery
        fetchData = fetchContributions
      } else {
        query = lastExpendituresQuery
        setQuery = setLastExpendituresQuery
        fetchData = fetchExpenditures
      }
      return { query, setQuery, fetchData }
    },
    [
      fetchContributions,
      fetchExpenditures,
      lastContributionsQuery,
      lastExpendituresQuery,
    ]
  )

  const handleDataFetch = useCallback(
    ({ sortBy, type }) => {
      // we don't support multisort, so get the first element in the sortBy array if it exists
      const sort = formatSortBy(sortBy)
      let { query, setQuery, fetchData } = getFunctionsAndQuery(type)
      if (sort !== query.sort) {
        query = { ...query, sort }
        setQuery(query)
        fetchData(query)
      }
    },
    [getFunctionsAndQuery]
  )

  const handleDataFetchContributions = useCallback(
    ({ sortBy }) => {
      handleDataFetch({ sortBy, type: 'contributions' })
    },
    [handleDataFetch]
  )

  const handleDataFetchExpenditures = useCallback(
    ({ sortBy }) => {
      handleDataFetch({ sortBy, type: 'expenditures' })
    },
    [handleDataFetch]
  )

  // Fetches the same page of contributions when user changes limit size
  const fetchSame = useCallback(
    ({ limit = API_BATCH_SIZE, type } = {}) => {
      let { query, setQuery, fetchData } = getFunctionsAndQuery(type)
      query = { ...query, limit }
      setQuery(query)
      fetchData(query)
    },
    [getFunctionsAndQuery]
  )

  const fetchSameContributions = useCallback(
    (limit) => fetchSame({ limit, type: 'contributions' }),
    [fetchSame]
  )

  const fetchSameExpenditures = useCallback(
    (limit) => fetchSame({ limit, type: 'expenditures' }),
    [fetchSame]
  )

  // Fetch next batch of contributions for pagination
  const fetchNext = useCallback(
    ({ limit = API_BATCH_SIZE, type } = {}) => {
      let { query, setQuery, fetchData } = getFunctionsAndQuery(type)
      query = { ...query, limit, offset: query.offset + limit }
      setQuery(query)
      fetchData(query)
    },
    [getFunctionsAndQuery]
  )

  const fetchNextContributions = useCallback(
    (limit) => fetchNext({ limit, type: 'contributions' }),
    [fetchNext]
  )

  const fetchNextExpenditures = useCallback(
    (limit) => fetchNext({ limit, type: 'expenditures' }),
    [fetchNext]
  )

  // Fetch previous batch of contributions for pagination
  const fetchPrevious = useCallback(
    ({ limit = API_BATCH_SIZE, type } = {}) => {
      let { query, setQuery, fetchData } = getFunctionsAndQuery(type)
      let offset = query.offset - limit < 0 ? 0 : query.offset - limit
      query = { ...query, limit, offset: offset }
      setQuery(query)
      fetchData(query)
    },
    [getFunctionsAndQuery]
  )

  const fetchPreviousContributions = useCallback(
    (limit) => fetchPrevious({ limit, type: 'contributions' }),
    [fetchPrevious]
  )

  const fetchPreviousExpenditures = useCallback(
    (limit) => fetchPrevious({ limit, type: 'expenditures' }),
    [fetchPrevious]
  )

  const { candidateContributionColumns, expenditureColumns } = useTableColumns()

  return (
    <div className="container">
      <GridContainer>
        <Grid row>
          <Grid col>
            <p className="candidate-label">CANDIDATE</p>
          </Grid>
        </Grid>
        <Grid row>
          <Grid col>
            <h1 className="candidate-name">{candidate.candidate_full_name}</h1>
            <p className="candidate-party">{candidate.party}</p>
            <p className="candidate-prop">
              <span className="candidate-prop-label">Contest:</span>
              {candidate.office}
            </p>
            {candidate.committee_name && (
              <p className="candidate-prop">
                <span className="candidate-prop-label">PAC:</span>
                {candidate.committee_name}
              </p>
            )}
          </Grid>
          <Grid col>
            <p className="summary-stat">
              <NumberFormat
                className="total-funding"
                value={summary.sum}
                displayType="text"
                decimalScale={0}
                fixedDecimalScale={true}
                thousandSeparator={true}
                prefix="$"
              />
            </p>
            <p className="total-funding-tooltip">Total Funding</p>
            <p className="summary-stat">
              Total number of donations:
              <NumberFormat
                className="summary-num"
                value={summary.count}
                displayType="text"
                thousandSeparator={true}
              />
            </p>
            <p className="summary-stat">
              Average donation amount:
              <NumberFormat
                className="summary-num"
                value={summary.avg}
                displayType="text"
                decimalScale={2}
                fixedDecimalScale={true}
                thousandSeparator={true}
                prefix="$"
              />
            </p>
            <p className="summary-stat">
              Largest donation amount:
              <NumberFormat
                className="summary-num"
                value={summary.max}
                displayType="text"
                decimalScale={2}
                fixedDecimalScale={true}
                thousandSeparator={true}
                prefix="$"
              />
            </p>
            <p className="summary-stat">
              Total Number of Aggregated Contributions:
              <NumberFormat
                className="summary-num"
                value={summary.aggregated_contributions_count}
                displayType="text"
                thousandSeparator={true}
              />
            </p>
            <p className="summary-stat">
              Sum of Aggregated Contributions:
              <NumberFormat
                className="summary-num"
                value={summary.aggregated_contributions_sum}
                displayType="text"
                decimalScale={2}
                fixedDecimalScale={true}
                thousandSeparator={true}
                prefix="$"
              />
            </p>
          </Grid>
        </Grid>

        {yearsStatus === STATUSES.Success && (
          <DateRange
            datePickerStart={datePickerStart}
            datePickerEnd={datePickerEnd}
            setDatePickerStart={setDatePickerStart}
            setDatePickerEnd={setDatePickerEnd}
            allYears={years}
          />
        )}

        <Grid row gap="sm">
          <Grid col={7} mobile={{ col: 6 }}>
            <p className="table-label">Contributors</p>
          </Grid>
          <Grid col={5} mobile={{ col: 6 }}>
            <ReportError />
            <a
              href={`${
                process.env.NODE_ENV === 'production'
                  ? ''
                  : 'http://localhost:3001'
              }/api/candidate/${candidateId}/contributions?toCSV=true&date_occurred_gte=${datePickerStart}&date_occurred_lte=${datePickerEnd}`}
            >
              <Button
                disabled={contributionCount === 0}
                className="csv-download-button"
              >
                Download Results
              </Button>
            </a>
          </Grid>
        </Grid>
        <Grid row>
          <Grid col>
            <SearchResultTable
              apiStatus={candidateApiStatus}
              columns={candidateContributionColumns}
              data={contributions}
              count={contributionCount}
              offset={lastContributionsQuery.offset}
              fetchSame={fetchSameContributions}
              fetchNext={fetchNextContributions}
              fetchPrevious={fetchPreviousContributions}
              searchTerm={candidateId}
              searchType="contributions"
              onFetchData={handleDataFetchContributions}
              initialSortBy={[{ id: 'date_occurred', desc: true }]}
            />
          </Grid>
        </Grid>
        <Grid row></Grid>
        <br />
        <br />
        <br />
        <Grid row gap="sm">
          <Grid col={7} mobile={{ col: 6 }}>
            <p className="table-label">Expenditures</p>
          </Grid>
          <Grid col={5} mobile={{ col: 6 }}>
            <a
              href={`${
                process.env.NODE_ENV === 'production'
                  ? ''
                  : 'http://localhost:3001'
              }/api/expenditures/${candidateId}?toCSV=true&date_occurred_gte=${datePickerStart}&date_occurred_lte=${datePickerEnd}`}
            >
              <Button
                className="csv-download-button"
                disabled={expenditureCount === 0}
              >
                Download Results
              </Button>
            </a>
          </Grid>
        </Grid>
        <Grid row>
          <Grid col>
            <SearchResultTable
              apiStatus={expendituresApiStatus}
              columns={expenditureColumns}
              data={expenditures}
              count={expenditureCount}
              offset={lastExpendituresQuery.offset}
              fetchSame={fetchSameExpenditures}
              fetchNext={fetchNextExpenditures}
              fetchPrevious={fetchPreviousExpenditures}
              searchTerm={candidateId}
              searchType="expenditures"
              onFetchData={handleDataFetchExpenditures}
              initialSortBy={[{ id: 'date_occurred', desc: true }]}
            />
          </Grid>
        </Grid>
      </GridContainer>
    </div>
  )
}

export default Candidate
