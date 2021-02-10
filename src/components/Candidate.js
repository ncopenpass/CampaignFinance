import React, { useEffect, useCallback, useState } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { Grid, GridContainer } from '@trussworks/react-uswds'
import NumberFormat from 'react-number-format'

import { useCandidate, useTableColumns } from '../hooks'
import { API_BATCH_SIZE } from '../constants'
import '../css/candidate.scss'
import { formatSortBy } from '../utils'

import SearchResultTable from './SearchResultTable'
import ReportError from './ReportError'

const Candidate = () => {
  let { candidateId } = useParams()
  const location = useLocation()
  const [lastQuery, setLastQuery] = useState({})

  const {
    apiStatus,
    candidate,
    contributions,
    summary,
    contributionCount,
    contributionOffset,
    fetchInitialSearchData,
    fetchContributions,
  } = useCandidate()

  useEffect(() => {
    if (fetchInitialSearchData) {
      const query = {
        candidateId,
        limit: API_BATCH_SIZE,
        offset: 0,
        sort: '-date_occurred',
      }
      setLastQuery(query)
      fetchInitialSearchData(query)
    }
  }, [candidateId, fetchInitialSearchData])

  const handleSortChange = useCallback(
    (sortBy) => {
      // we don't support multisort, so get the first element in the sortBy array if it exists
      const sort = formatSortBy(sortBy)
      if (sort !== lastQuery.sort) {
        const query = { ...lastQuery, sort }
        setLastQuery(query)
        fetchContributions(query)
      }
    },
    [lastQuery, fetchContributions]
  )

  // Fetches the same page of contributions when user changes limit size
  const fetchSameContributions = useCallback(
    (limit = API_BATCH_SIZE) => {
      const query = { ...lastQuery, limit }
      setLastQuery(query)
      fetchContributions(query)
    },
    [fetchContributions, lastQuery]
  )

  // Fetch next batch of contributions for pagination
  const fetchNextContributions = useCallback(
    (limit = API_BATCH_SIZE) => {
      const query = { ...lastQuery, limit, offset: lastQuery.offset + limit }
      setLastQuery(query)
      fetchContributions(query)
    },
    [fetchContributions, lastQuery]
  )

  // Fetch previous batch of contributions for pagination
  const fetchPreviousContributions = useCallback(
    (limit = API_BATCH_SIZE) => {
      const query = { ...lastQuery, limit, offset: lastQuery.offset - limit }
      setLastQuery(query)
      fetchContributions(query)
    },
    [fetchContributions, lastQuery]
  )

  const { candidateContributionColumns } = useTableColumns()

  return (
    <div className="container">
      <GridContainer>
        <Grid row>
          <Grid col>
            {location?.fromPathname ? (
              <Link to={location.fromPathname}>Back to search results</Link>
            ) : null}
          </Grid>
        </Grid>
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
            {/* 
              Placeholder value for Last Contest and Associated Candidate PAC until we have that data 
              Placeholder value for href
            */}
            {/* <p className="candidate-prop">
              <span className="candidate-prop-label">Last Contest:</span>
              <a href="/">Gubernatorial Election 2020</a>
            </p>
            <p className="candidate-prop">
              <span className="candidate-prop-label">
                Associated Candidate PAC:
              </span>
              Cooper for North Carolina
            </p> */}
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
              }/api/candidate/${candidateId}/contributions?toCSV=true`}
            >
              Download Results
            </a>
          </Grid>
        </Grid>
        <Grid row>
          <Grid col>
            <SearchResultTable
              apiStatus={apiStatus}
              columns={candidateContributionColumns}
              data={contributions}
              count={contributionCount}
              offset={contributionOffset}
              fetchSame={fetchSameContributions}
              fetchNext={fetchNextContributions}
              fetchPrevious={fetchPreviousContributions}
              searchTerm={candidateId}
              searchType="contributions"
              onChangeSort={handleSortChange}
              initialSortBy={[{ id: 'date_occurred', desc: true }]}
            />
          </Grid>
        </Grid>
      </GridContainer>
    </div>
  )
}

export default Candidate
