import React, { useEffect, useCallback } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { Grid, GridContainer } from '@trussworks/react-uswds'

import { useContributors } from '../hooks/useContributors'
import { API_BATCH_SIZE } from '../constants'
import '../css/candidate.scss'

const Contributor = () => {
  let { contributorId } = useParams()
  const location = useLocation()

  const {
    hasError,
    contributor,
    contributions,
    summary,
    contributionCount,
    contributionOffset,
    fetchInitialSearchData,
    fetchContributor,
  } = useContributors()

  useEffect(() => {
    if (fetchInitialSearchData) {
      fetchInitialSearchData({ contributorId })
    }
  }, [contributorId, fetchInitialSearchData])

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
            <h1 className="candidate-name">{'contributor name'}</h1>
          </Grid>
        </Grid>
      </GridContainer>
    </div>
  )
}

export default Contributor
