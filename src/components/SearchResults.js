import React, { useEffect, useMemo, useCallback } from 'react'
import { useParams } from 'react-router'
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
  const { searchTerm } = useParams()

  const {
    hasError,
    contributors,
    candidates,
    contributorCount,
    candidateCount,
    contributorOffset,
    candidateOffset,
    fetchCandidates,
    fetchContributors,
    fetchInitialSearchData,
  } = useSearch()

  const { contributorColumns, candidateColumns } = useTableColumns()

  useEffect(() => {
    if (fetchInitialSearchData) {
      fetchInitialSearchData({ searchTerm })
    }
  }, [searchTerm, fetchInitialSearchData])

  // Table limit and pagination functions for Candidates
  const fetchSameCandidates = useCallback(
    (limit = API_BATCH_SIZE) => {
      fetchCandidates({
        searchTerm,
        limit: limit,
        offset: candidateOffset,
      })
    },
    [candidateOffset, fetchCandidates, searchTerm]
  )

  const fetchNextCandidates = useCallback(
    (limit = API_BATCH_SIZE) => {
      fetchCandidates({
        searchTerm,
        limit: limit,
        offset: candidateOffset + limit,
      })
    },
    [candidateOffset, fetchCandidates, searchTerm]
  )

  const fetchPreviousCandidates = useCallback(
    (limit = API_BATCH_SIZE) => {
      fetchCandidates({
        searchTerm,
        limit: limit,
        offset: candidateOffset - limit,
      })
    },
    [candidateOffset, searchTerm, fetchCandidates]
  )

  // Table limit and pagination functions for Contributors
  const fetchSameContributors = useCallback(
    (limit = API_BATCH_SIZE) => {
      fetchContributors({
        searchTerm,
        limit: limit,
        offset: contributorOffset,
      })
    },
    [contributorOffset, fetchContributors, searchTerm]
  )

  const fetchNextContributors = useCallback(
    (limit = API_BATCH_SIZE) => {
      fetchContributors({
        searchTerm,
        limit: limit,
        offset: contributorOffset + limit,
      })
    },
    [contributorOffset, fetchContributors, searchTerm]
  )

  const fetchPreviousContributors = useCallback(
    (limit = API_BATCH_SIZE) => {
      fetchContributors({
        searchTerm,
        limit: limit,
        offset: contributorOffset - limit,
      })
    },
    [contributorOffset, searchTerm, fetchContributors]
  )

  const resultsTables = useMemo(
    () => [
      {
        title: `Candidates (${candidateCount}) matching "${searchTerm}"`,
        content: (
          <SearchResultTable
            columns={candidateColumns}
            data={candidates}
            count={candidateCount}
            offset={candidateOffset}
            fetchSame={fetchSameCandidates}
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
        title: `Contributors (${contributorCount}) matching "${searchTerm}"`,
        content: (
          <SearchResultTable
            columns={contributorColumns}
            data={contributors}
            count={contributorCount}
            offset={contributorOffset}
            fetchSame={fetchSameContributors}
            fetchNext={fetchNextContributors}
            fetchPrevious={fetchPreviousContributors}
            searchTerm={searchTerm}
            searchType="contributors"
          />
        ),
        expanded: true,
        id: 'contributors',
      },
    ],
    [
      candidateColumns,
      candidates,
      candidateCount,
      candidateOffset,
      contributorColumns,
      contributors,
      contributorCount,
      contributorOffset,
      searchTerm,
      fetchSameCandidates,
      fetchNextCandidates,
      fetchPreviousCandidates,
      fetchSameContributors,
      fetchNextContributors,
      fetchPreviousContributors,
    ]
  )

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
