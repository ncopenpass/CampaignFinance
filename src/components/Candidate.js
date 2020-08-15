import React, { useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom'
import {
  Accordion,
  Grid,
  GridContainer
} from '@trussworks/react-uswds';

import { useCandidate } from '../hooks'
import { API_BATCH_SIZE } from '../constants'

import SearchResultTable from './SearchResultTable'
import '../css/candidate.scss';

const Candidate = () => {
  let { candidateId } = useParams()

  const {
    hasError,
    candidate,
    contributions,
    contributionCount,
    contributionOffset,
    fetchInitialSearchData,
    fetchCandidate,
    fetchContributions,
  } = useCandidate();

  useEffect(() => {
    if (fetchInitialSearchData) {
      fetchInitialSearchData({ candidateId })
    }
  }, [candidateId, fetchInitialSearchData])

  const fetchNextContributions = useCallback(() => {
    fetchContributions({
      candidateId,
      offset: contributionOffset + API_BATCH_SIZE,
    })
  }, [contributionOffset, fetchContributions, candidateId])

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
        accessor: 'purpose'
      }
    ],
    []
  )

  return (
    <div className='container'>
      <GridContainer>
        <Grid row>
          <Grid col>
            {/* Placeholder value for href */}
            <a href='/'>Back to search results</a>
          </Grid>
        </Grid>
        <Grid row>
          <Grid col>
            <p class='candidate-label'>CANDIDATE</p>
          </Grid>
        </Grid>
        <Grid row>
          <Grid col>
            <h1 class='candidate-name'>{ candidate.candidate_first_last_name }</h1>
            <p class='candidate-party'>{ candidate.party }</p>
            <p class='candidate-prop'><span class='candidate-prop-label'>Current Office:</span> { candidate.office }</p>
            {/* 
              Placeholder value for Last Contest and Associated Candidate PAC until we have that data 
              Placeholder value for href
            */}
            <p class='candidate-prop'><span class='candidate-prop-label'>Last Contest:</span> <a href='/'>Gubernatorial Election 2020</a></p>
            <p class='candidate-prop'><span class='candidate-prop-label'>Associated Candidate PAC:</span> Cooper for North Carolina</p>
          </Grid>
          <Grid col>
            {/* Placeholder value for Total Funding until we have that data */}
            <p class='total-funding'>$234,138.53</p>
            <p class='total-funding-tooltip'>Total Funding</p>
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

export default Candidate;