import React, { useEffect, useCallback } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { Grid, GridContainer } from '@trussworks/react-uswds'

import { useContributors } from '../hooks/useContributors'
import SearchResultTable from './SearchResultTable'
import { useTableColumns } from '../hooks'
import { API_BATCH_SIZE } from '../constants'
import ReportError from './ReportError'

import '../css/candidate.scss'

const Contributor = () => {
  let { contributorId } = useParams()
  const location = useLocation()

  const {
    contributor,
    contributions,
    summary,
    contributionCount,
    contributionOffset,
    fetchInitialSearchData,
    fetchContributor,
    fetchContributorContributions,
  } = useContributors()

  useEffect(() => {
    if (fetchInitialSearchData) {
      fetchInitialSearchData({ contributorId })
    }
  }, [contributorId, fetchInitialSearchData])

  const fetchSameContributions = useCallback(
    (limit = API_BATCH_SIZE) => {
      fetchContributor({
        contributorId,
        limit: limit,
        offset: contributionOffset,
      })
    },
    [contributionOffset, fetchContributor, contributorId]
  )

  const fetchNextContributions = useCallback(
    (limit = API_BATCH_SIZE) => {
      fetchContributorContributions({
        contributorId,
        limit: limit,
        offset: contributionOffset + limit,
      })
    },
    [contributionOffset, fetchContributorContributions, contributorId]
  )

  const fetchPreviousContributions = useCallback(
    (limit = API_BATCH_SIZE) => {
      fetchContributorContributions({
        contributorId,
        limit: limit,
        offset: contributionOffset - limit,
      })
    },
    [contributionOffset, contributorId, fetchContributorContributions]
  )

  const { individualContributionsColumns } = useTableColumns()

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
              <span className="candidate-prop-label">City/State:</span>'
              {contributor.city}/{contributor.state}'
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
              data={contributions}
              count={contributionCount}
              fetchSame={fetchSameContributions}
              fetchNext={fetchNextContributions}
              fetchPrevious={fetchPreviousContributions}
              offset={contributionOffset}
              searchTerm={contributor.name}
              searchType="contributions"
            />
          </Grid>
        </Grid>
      </GridContainer>
    </div>
  )
}

export default Contributor
