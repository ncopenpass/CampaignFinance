import React, { useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { Grid, GridContainer } from '@trussworks/react-uswds'
import NumberFormat from 'react-number-format'

import { useCandidate, useTableColumns } from '../hooks'
import { API_BATCH_SIZE } from '../constants'
import '../css/candidate.scss'

import SearchResultTable from './SearchResultTable'

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

  const { candidateContributionColumns } = useTableColumns()

  return (
    <div className="container">
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
              <span className="candidate-prop-label">Current Office:</span>
              {candidate.office}
            </p>
            {/* 
              Placeholder value for Last Contest and Associated Candidate PAC until we have that data 
              Placeholder value for href
            */}
            <p className="candidate-prop">
              <span className="candidate-prop-label">Last Contest:</span>
              <a href="/">Gubernatorial Election 2020</a>
            </p>
            <p className="candidate-prop">
              <span className="candidate-prop-label">
                Associated Candidate PAC:
              </span>
              Cooper for North Carolina
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
          </Grid>
        </Grid>
        <Grid row>
          <Grid col>
            <SearchResultTable
              columns={candidateContributionColumns}
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
