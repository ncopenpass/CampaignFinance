import React, { useEffect, useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Grid, GridContainer } from '@trussworks/react-uswds'

import { useContributors } from '../hooks/useContributors'
import SearchResultTable from './SearchResultTable'
import { useTableColumns } from '../hooks'
import { API_BATCH_SIZE } from '../constants'
import ReportError from './ReportError'
import { formatSortBy } from '../utils'

import '../css/candidate.scss'

const Contributor = () => {
  let { contributorId } = useParams()

  const {
    contributor,
    apiStatus,
    contributions,
    contributionCount,
    contributionOffset,
    fetchInitialSearchData,
    fetchContributorContributions,
  } = useContributors()

  const [query, setQuery] = useState({
    contributorId,
    limit: API_BATCH_SIZE,
    offset: 0,
    sort: '-date_occurred',
  })

  useEffect(() => {
    if (fetchInitialSearchData) {
      fetchInitialSearchData({
        contributorId,
        limit: API_BATCH_SIZE,
        offset: 0,
        sort: '-date_occurred',
      })
    }
  }, [contributorId, fetchInitialSearchData])

  const handleFetchContributions = useCallback(
    ({ sortBy }) => {
      const sort = formatSortBy(sortBy)
      if (sort !== query.sort) {
        const q = { ...query, sort }
        setQuery(q)
        fetchContributorContributions(q)
      }
    },
    [fetchContributorContributions, query]
  )

  const fetchSameContributions = useCallback(
    (limit = API_BATCH_SIZE) => {
      const q = { ...query, limit }
      setQuery(q)
      fetchContributorContributions(q)
    },
    [fetchContributorContributions, query]
  )

  const fetchNextContributions = useCallback(
    (limit = API_BATCH_SIZE) => {
      const q = { ...query, offset: query.offset + limit }
      setQuery(q)
      fetchContributorContributions(q)
    },
    [fetchContributorContributions, query]
  )

  const fetchPreviousContributions = useCallback(
    (limit = API_BATCH_SIZE) => {
      const q = { ...query, offset: query.offset - limit }
      setQuery(q)
      fetchContributorContributions(q)
    },
    [fetchContributorContributions, query]
  )

  const { individualContributionsColumns } = useTableColumns()

  return (
    <div className="container">
      <GridContainer>
        <Grid row>
          <Grid col>
            <p className="contributor-label">CONTRIBUTOR</p>
          </Grid>
        </Grid>
        <Grid row>
          <Grid col>
            <h1 className="candidate-name">{contributor.name}</h1>
            <p className="candidate-prop">
              <span className="candidate-prop-label">Job Title:</span>
              {contributor.profession}
            </p>
            <p className="candidate-prop">
              <span className="candidate-prop-label">Employer:</span>
              {contributor.employer_name}
            </p>
            <p className="candidate-prop">
              <span className="candidate-prop-label">City/State:</span>
              {`${contributor.city}, ${contributor.state}`}
            </p>
          </Grid>
        </Grid>
        <Grid row></Grid>
        <Grid row gap="sm">
          <Grid col={7} mobile={{ col: 6 }}>
            <p className="table-label">Contributions</p>
          </Grid>
          <Grid col={5} mobile={{ col: 6 }}>
            <ReportError />
            <a
              className="usa-button csv-download-button"
              href={`${
                process.env.NODE_ENV === 'production'
                  ? ''
                  : 'http://localhost:3001'
              }/api/contributor/${contributorId}/contributions?toCSV=true`}
            >
              Download Results
            </a>
          </Grid>
        </Grid>
        <Grid row>
          <Grid col>
            <SearchResultTable
              columns={individualContributionsColumns}
              apiStatus={apiStatus}
              data={contributions}
              count={contributionCount}
              fetchSame={fetchSameContributions}
              fetchNext={fetchNextContributions}
              fetchPrevious={fetchPreviousContributions}
              offset={contributionOffset}
              searchTerm={contributor.name}
              searchType="contributions"
              onFetchData={handleFetchContributions}
              initialSortBy={[{ id: 'date_occurred', desc: true }]}
            />
          </Grid>
        </Grid>
      </GridContainer>
    </div>
  )
}

export default Contributor
