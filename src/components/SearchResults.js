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

  const fetchNextContributors = useCallback(() => {
    fetchContributors({
      searchTerm,
      offset: contributorOffset + API_BATCH_SIZE,
    })
  }, [contributorOffset, fetchContributors, searchTerm])

  const fetchPreviousContributors = useCallback(() => {
    fetchContributors({
      searchTerm,
      offset: contributorOffset - API_BATCH_SIZE,
    })
  }, [contributorOffset, searchTerm, fetchContributors])

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
      fetchNextCandidates,
      fetchPreviousCandidates,
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
