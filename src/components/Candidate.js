import React, { useEffect, useMemo, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { Grid, GridContainer } from '@trussworks/react-uswds'

import { useCandidate } from '../hooks'
import { API_BATCH_SIZE } from '../constants'

import SearchResultTable from './SearchResultTable'
import '../css/candidate.scss'

const Candidate = () => {
  let { candidateId } = useParams()

  const {
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
      fetchInitialSearchData({ candidateId })
    }
  }, [candidateId, fetchInitialSearchData])

  // Fetch next batch of contributions for pagination
  const fetchNextContributions = useCallback(() => {
    fetchContributions({
      candidateId,
      offset: contributionOffset + API_BATCH_SIZE,
    })
  }, [contributionOffset, fetchContributions, candidateId])

  // Fetch previous batch of contributions for pagination
  const fetchPreviousContributions = useCallback(() => {
    fetchContributions({
      candidateId,
      offset: contributionOffset - API_BATCH_SIZE,
    })
  }, [contributionOffset, candidateId, fetchContributions])

  const columns = useMemo(
    () => [
      {
        Header: 'Donor Name',
        accessor: 'name',
      },
      {
        Header: 'Donor Type',
        accessor: 'transaction_type',
      },
      {
        Header: 'Amount',
        accessor: 'amount',
      },
      {
        Header: 'Donation Type',
        accessor: 'form_of_payment',
      },
      {
        Header: 'Donation Date',
        accessor: 'date_occurred',
      },
      {
        Header: 'Description',
        accessor: 'purpose',
      },
    ],
    []
  )

  return (
    <div classNameName="container">
      <GridContainer>
        <Grid row>
          <Grid col>
            {/* Placeholder value for href */}
            <a href="/">Back to search results</a>
          </Grid>
        </Grid>
        <Grid row>
          <Grid col>
            <p className="candidate-label">CANDIDATE</p>
          </Grid>
        </Grid>
        <Grid row>
          <Grid col>
            <h1 className="candidate-name">
              {candidate.candidate_first_last_name}
            </h1>
            <p className="candidate-party">{candidate.party}</p>
            <p className="candidate-prop">
              <span className="candidate-prop-label">Current Office:</span>{' '}
              {candidate.office}
            </p>
            {/* 
              Placeholder value for Last Contest and Associated Candidate PAC until we have that data 
              Placeholder value for href
            */}
            <p className="candidate-prop">
              <span className="candidate-prop-label">Last Contest:</span>{' '}
              <a href="/">Gubernatorial Election 2020</a>
            </p>
            <p className="candidate-prop">
              <span className="candidate-prop-label">
                Associated Candidate PAC:
              </span>{' '}
              Cooper for North Carolina
            </p>
          </Grid>
          <Grid col>
            {/* Placeholder value for Total Funding until we have that data */}
            <p className="total-funding">${summary.sum}</p>
            <p className="total-funding-tooltip">Total Funding</p>
            <p className="summary-stat">
              Total number of donations:{' '}
              <span className="summary-num">{summary.count}</span>
            </p>
            <p className="summary-stat">
              Average donation amount:{' '}
              <span className="summary-num">${summary.avg}</span>
            </p>
            <p className="summary-stat">
              Largest donation amount:{' '}
              <span className="summary-num">${summary.max}</span>
            </p>
          </Grid>
        </Grid>
        <Grid row>
          <Grid col>
            <SearchResultTable
              columns={columns}
              data={contributions}
              count={contributionCount}
              offset={contributionOffset}
              fetchNext={fetchNextContributions}
              fetchPrevious={fetchPreviousContributions}
              searchTerm={candidateId}
              searchType="contributions"
            />
          </Grid>
        </Grid>
      </GridContainer>
    </div>
  )
}

export default Candidate
