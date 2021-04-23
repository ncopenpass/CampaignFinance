import React, { useEffect, useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Grid, GridContainer } from '@trussworks/react-uswds'
import NumberFormat from 'react-number-format'

import { useCommittee, useTableColumns } from '../hooks'
import { API_BATCH_SIZE } from '../constants'
import '../css/candidate.scss'
import { formatSortBy } from '../utils'

import SearchResultTable from './SearchResultTable'
import ReportError from './ReportError'

const Committee = () => {
  let { committeeId } = useParams()
  const [lastQuery, setLastQuery] = useState({})

  const {
    apiStatus,
    committee,
    contributions,
    summary,
    contributionCount,
    fetchInitialSearchData,
    fetchContributions,
  } = useCommittee()

  useEffect(() => {
    if (fetchInitialSearchData) {
      const query = {
        committeeId,
        limit: API_BATCH_SIZE,
        offset: 0,
        sort: '-date_occurred',
      }
      setLastQuery(query)
      fetchInitialSearchData(query)
    }
  }, [committeeId, fetchInitialSearchData])

  const handleDataFetch = useCallback(
    ({ sortBy }) => {
      // we don't support multisort, so get the first element in the sortBy array and if it exists
      const sort = formatSortBy(sortBy)
      if (sort !== lastQuery.sort) {
        const query = { ...lastQuery, sort }
        setLastQuery(query)
        fetchContributions(query)
      }
    },
    [lastQuery, fetchContributions]
  )

  // Fetches the same page of the contributions when user changes limit size
  const fetchSameContributions = useCallback(
    (limit = API_BATCH_SIZE) => {
      const query = { ...lastQuery, limit }
      setLastQuery(query)
      fetchContributions(query)
    },
    [fetchContributions, lastQuery]
  )

  const fetchNextContributions = useCallback(
    (limit = API_BATCH_SIZE) => {
      const query = { ...lastQuery, limit, offset: lastQuery.offset + limit }
      setLastQuery(query)
      fetchContributions(query)
    },
    [fetchContributions, lastQuery]
  )

  const fetchPreviousContributions = useCallback(
    (limit = API_BATCH_SIZE) => {
      const query = { ...lastQuery, limit, offset: lastQuery.offset - limit }
      setLastQuery(query)
      fetchContributions(query)
    },
    [fetchContributions, lastQuery]
  )

  const { committeeContributionColumns } = useTableColumns()

  return (
    <div className="container">
      <GridContainer>
        <Grid row>
          <Grid col>
            <p className="candidate-label">COMMITTEE</p>
          </Grid>
        </Grid>
        <Grid row>
          <Grid col>
            <h1 className="candiate-name">{committee.committee_name}</h1>
            <p className="candidate-party">{committee.party}</p>
            <p className="location">HOLD FOR LOCATION</p>
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
            <p className="total-funding-tooltop">Total Funding</p>
            <p className="summary-stat">
              Total number of donations:
              <NumberFormat
                className="summary-sum"
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
              apiStatus={apiStatus}
              columns={committeeContributionColumns}
              data={contributions}
              count={contributionCount}
              offset={lastQuery.offset}
              fetchSame={fetchSameContributions}
              fetchNext={fetchNextContributions}
              fetchPrevious={fetchPreviousContributions}
              searchTerm={committeeId}
              searchType="contributions"
              onFetchData={handleDataFetch}
              inititalSortBy={[{ id: 'date_occurred', desc: true }]}
            />
          </Grid>
        </Grid>
      </GridContainer>
    </div>
  )
}

export default Committee
