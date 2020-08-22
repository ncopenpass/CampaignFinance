import React, { useEffect, useMemo, useCallback } from 'react'
import { useParams, useLocation } from 'react-router'
import { GridContainer, Alert, Accordion } from '@trussworks/react-uswds'
import styled from '@emotion/styled'

import { useSearch, useTableColumns } from '../hooks'
import { API_BATCH_SIZE } from '../constants'

import SearchBar from './SearchBar'
import SearchResultTable from './SearchResultTable'

const SearchBarContainer = styled.div`
  padding: 20px 0px;
`
const SearchResults = React.memo(() => {
  let { searchTerm } = useParams()
  let location = useLocation()
  let quickCandidateSearchParam
  let quickDonorSearchParam
  if (location.state !== undefined) {
    if (location.state.candidateQuickSearch !== undefined) {
      quickCandidateSearchParam = location.state.candidateQuickSearch
    }
  }
  if (location.state !== undefined) {
    if (location.state.donorQuickSearch !== undefined) {
      quickDonorSearchParam = location.state.donorQuickSearch
    }
  }

  const {
    hasError,
    donors,
    candidates,
    donorCount,
    candidateCount,
    donorOffset,
    candidateOffset,
    fetchCandidates,
    fetchDonors,
    fetchInitialSearchData,
    fetchInitialQuickCandidate,
    fetchInitialQuickDonor,
    fetchQuickDonors,
    fetchQuickCandidates,
  } = useSearch()
  const { donorColumns, candidateColumns } = useTableColumns()

  useEffect(() => {
    if (!quickCandidateSearchParam && !quickDonorSearchParam) {
      if (fetchInitialSearchData) {
        fetchInitialSearchData({ searchTerm })
      }
    }
    if (quickCandidateSearchParam) {
      if (fetchInitialQuickCandidate) {
        fetchInitialQuickCandidate({ searchTerm })
      }
    }
    if (quickDonorSearchParam) {
      if (fetchInitialQuickDonor) {
        fetchInitialQuickDonor({ searchTerm })
      }
    }
  }, [
    searchTerm,
    fetchInitialSearchData,
    fetchInitialQuickCandidate,
    fetchInitialQuickDonor,
    quickCandidateSearchParam,
    quickDonorSearchParam,
  ])

  const fetchNextCandidates = useCallback(() => {
    fetchCandidates({
      searchTerm,
      offset: candidateOffset + API_BATCH_SIZE,
    })
  }, [candidateOffset, fetchCandidates, searchTerm])

  const fetchPreviousCandidates = useCallback(() => {
    fetchCandidates({
      searchTerm,
      offset: candidateOffset - API_BATCH_SIZE,
    })
  }, [candidateOffset, searchTerm, fetchCandidates])

  const fetchNextQuickCandidates = useCallback(() => {
    fetchQuickCandidates({
      searchTerm,
      offset: candidateOffset + API_BATCH_SIZE,
    })
  }, [candidateOffset, fetchQuickCandidates, searchTerm])

  const fetchNextQuickDonors = useCallback(() => {
    fetchQuickDonors({
      searchTerm,
      offset: donorOffset + API_BATCH_SIZE,
    })
  }, [donorOffset, fetchQuickDonors, searchTerm])

  const fetchNextDonors = useCallback(() => {
    fetchDonors({
      searchTerm,
      offset: donorOffset + API_BATCH_SIZE,
    })
  }, [donorOffset, fetchDonors, searchTerm])

  const fetchPreviousDonors = useCallback(() => {
    fetchDonors({
      searchTerm,
      offset: donorOffset - API_BATCH_SIZE,
    })
  }, [donorOffset, searchTerm, fetchDonors])

  let resultsTables

  if (quickCandidateSearchParam) {
    resultsTables = useMemo(
      () => [
        {
          title: `2020 Candidates (${candidateCount}) "`,
          content: (
            <SearchResultTable
              columns={candidateColumns}
              data={candidates}
              count={candidateCount}
              offset={candidateOffset}
              fetchNext={fetchNextQuickCandidates}
              //fetchPrevious={fetchPreviousCandidates}
              searchTerm={searchTerm}
              searchType="candidates"
            />
          ),
          expanded: true,
          id: 'candidates',
        },
      ],
      [
        candidateColumns,
        candidates,
        candidateCount,
        candidateOffset,
        searchTerm,
        fetchNextQuickCandidates,
        //fetchNextCandidates,
        //fetchPreviousCandidates,
      ]
    )
  } else if (quickDonorSearchParam) {
    resultsTables = useMemo(
      () => [
        {
          title: `2020 Contributors(${donorCount})"`,
          content: (
            <SearchResultTable
              columns={donorColumns}
              data={donors}
              count={donorCount}
              offset={donorOffset}
              fetchNext={fetchNextQuickDonors}
              //fetchPrevious={fetchPreviousCandidates}
              searchTerm={searchTerm}
              searchType="donors"
            />
          ),
          expanded: true,
          id: 'donors',
        },
      ],
      [
        donorColumns,
        donors,
        donorCount,
        donorOffset,
        searchTerm,
        fetchNextQuickDonors,
      ]
    )
  } else {
    resultsTables = useMemo(
      () => [
        {
          title: `Candidates (${candidateCount}) matching "${searchTerm}"`,
          content: (
            <SearchResultTable
              columns={candidateColumns}
              data={candidates}
              count={candidateCount}
              offset={candidateOffset}
              fetchNext={fetchNextCandidates}
              fetchPrevious={fetchPreviousCandidates}
              searchTerm={searchTerm}
              searchType="candidates"
            />
          ),
          expanded: true,
          id: 'candidates',
        },
        {
          title: `Donors (${donorCount}) matching "${searchTerm}"`,
          content: (
            <SearchResultTable
              columns={donorColumns}
              data={donors}
              count={donorCount}
              offset={donorOffset}
              fetchNext={fetchNextDonors}
              fetchPrevious={fetchPreviousDonors}
              searchTerm={searchTerm}
              searchType="donors"
            />
          ),
          expanded: true,
          id: 'donors',
        },
      ],
      [
        candidateColumns,
        candidates,
        candidateCount,
        candidateOffset,
        donorColumns,
        donors,
        donorCount,
        donorOffset,
        searchTerm,
        fetchNextCandidates,
        fetchPreviousCandidates,
        fetchNextDonors,
        fetchPreviousDonors,
      ]
    )
  }
  return (
    <GridContainer>
      {hasError ? (
        <Alert slim type="error">
          Error fetching search data
        </Alert>
      ) : (
        <>
          <SearchBarContainer>
            <SearchBar hideQuickLinks />
          </SearchBarContainer>
          <Accordion items={resultsTables} />
        </>
      )}
    </GridContainer>
  )
})

export default SearchResults
