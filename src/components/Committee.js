import React, { useEffect, useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Grid, GridContainer } from '@trussworks/react-uswds'
import NumberFormat from 'react-number-format'

import { useCommittee, useTableColumns, useExpenditures } from '../hooks'
import { API_BATCH_SIZE } from '../constants'
import '../css/committee.scss'
import { formatSortBy } from '../utils'

import SearchResultTable from './SearchResultTable'
import ReportError from './ReportError'

const Committee = () => {
  let { committeeId } = useParams()
  const [lastContributionsQuery, setLastContributionsQuery] = useState({})
  const [lastExpendituresQuery, setLastExpendituresQuery] = useState({})

  const {
    apiStatus: committeeApiStatus,
    committee,
    contributions,
    summary,
    contributionCount,
    fetchInitialSearchData,
    fetchContributions,
  } = useCommittee()

  const {
    apiStatus: expendituresApiStatus,
    expenditures,
    expenditureCount,
    fetchExpenditures,
  } = useExpenditures()

  useEffect(() => {
    if (fetchInitialSearchData && fetchExpenditures) {
      let query = {
        committeeId,
        limit: API_BATCH_SIZE,
        offset: 0,
        sort: '-date_occurred',
      }
      setLastContributionsQuery(query)
      fetchInitialSearchData(query)
      query = { ...query, ncsbeID: query.committeeId }
      setLastExpendituresQuery(query)
      fetchExpenditures(query)
    }
  }, [committeeId, fetchInitialSearchData, fetchExpenditures])

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
      // we don't support multisort, so get the first element in the sortBy array and if it exists
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
      query = { ...query, limit, offset: query.offset - limit }
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

  const { committeeContributionColumns, expenditureColumns } = useTableColumns()

  return (
    <div className="container">
      <GridContainer>
        <Grid row>
          <Grid col>
            <p className="candidate-label">POLITICAL ACTION COMMITTEE (PAC)</p>
          </Grid>
        </Grid>
        <Grid row>
          <Grid col>
            <h1 className="committee-name">{committee.committee_name}</h1>
            <p className="committee-prop">
              <span className="committee-prop-label">Party:</span>
              {committee.party}
            </p>
            <p className="committee-prop">
              <span className="committee-prop-label">Location:</span>
              {`${committee.city}, ${committee.state}`}
            </p>
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
        <Grid row></Grid>
        <Grid row gap="sm">
          <Grid col={7} mobile={{ col: 6 }}>
            <p className="table-label">Contributors</p>
          </Grid>
          <Grid col={5} mobile={{ col: 6 }}>
            <ReportError />
            <a
              className="usa-button csv-download-button"
              href={`${
                process.env.NODE_ENV === 'production'
                  ? ''
                  : 'http://localhost:3001'
              }/api/committee/${committeeId}/contributions?toCSV=true`}
            >
              Download Results
            </a>
          </Grid>
        </Grid>
        <Grid row>
          <Grid col>
            <SearchResultTable
              apiStatus={committeeApiStatus}
              columns={committeeContributionColumns}
              data={contributions}
              count={contributionCount}
              offset={lastContributionsQuery.offset}
              fetchSame={fetchSameContributions}
              fetchNext={fetchNextContributions}
              fetchPrevious={fetchPreviousContributions}
              searchTerm={committeeId}
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
              className="usa-button csv-download-button"
              href={`${
                process.env.NODE_ENV === 'production'
                  ? ''
                  : 'http://localhost:3001'
              }/api/expenditures/${committeeId}?toCSV=true`}
            >
              Download Results
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
              searchTerm={committeeId}
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

export default Committee
