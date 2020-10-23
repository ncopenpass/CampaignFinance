import React, { useEffect, useMemo, useCallback, useState } from 'react'
import { useParams } from 'react-router'
import { GridContainer, Alert, Accordion } from '@trussworks/react-uswds'
import styled from '@emotion/styled'

import { useSearch, useTableColumns } from '../hooks'
import { API_BATCH_SIZE } from '../constants'

import SearchBar from './SearchBar'
import SearchResultTable from './SearchResultTable'
import { formatSortBy } from '../utils'

const SearchBarContainer = styled.div`
  padding: 20px 0px;
`
const SearchResults = React.memo(() => {
  const { searchTerm } = useParams()
  const [lastCandidatesQuery, setLastCandidatesQuery] = useState({})
  const [lastContributorsQuery, setLastContributorsQuery] = useState({})

  const {
    hasError,
    contributors,
    candidates,
    contributorCount,
    candidateCount,
    fetchCandidates,
    fetchContributors,
    fetchInitialSearchData,
  } = useSearch()

  const { contributorColumns, candidateColumns } = useTableColumns()

  useEffect(() => {
    if (fetchInitialSearchData) {
      const query = {
        searchTerm,
        offset: 0,
        limit: API_BATCH_SIZE,
      }
      setLastCandidatesQuery(query)
      setLastContributorsQuery(query)
      fetchInitialSearchData({ searchTerm })
    }
  }, [searchTerm, fetchInitialSearchData])

  const handleCandidateSort = useCallback(
    (sortBy) => {
      const sort = formatSortBy(sortBy)
      if (sort !== lastCandidatesQuery.sort) {
        const query = { ...lastCandidatesQuery, sort }
        setLastCandidatesQuery(query)
        fetchCandidates(query)
      }
    },
    [fetchCandidates, lastCandidatesQuery]
  )

  const handleContributorsSort = useCallback(
    (sortBy) => {
      const sort = formatSortBy(sortBy)
      if (sort !== lastCandidatesQuery.sort) {
        const query = { ...lastCandidatesQuery, sort }
        setLastCandidatesQuery(query)
        fetchCandidates(query)
      }
    },
    [fetchCandidates, lastCandidatesQuery]
  )

  // Table limit and pagination functions for Candidates
  const fetchSameCandidates = useCallback(
    (limit = API_BATCH_SIZE) => {
      const query = { ...lastCandidatesQuery, limit }
      setLastCandidatesQuery(query)
      fetchCandidates(query)
    },
    [fetchCandidates, lastCandidatesQuery]
  )

  const fetchNextCandidates = useCallback(
    (limit = API_BATCH_SIZE) => {
      const query = {
        ...lastCandidatesQuery,
        limit,
        offset: lastCandidatesQuery.offset + limit,
      }
      setLastCandidatesQuery(query)
      fetchCandidates(query)
    },
    [fetchCandidates, lastCandidatesQuery]
  )

  const fetchPreviousCandidates = useCallback(
    (limit = API_BATCH_SIZE) => {
      const query = {
        ...lastCandidatesQuery,
        limit,
        offset: lastCandidatesQuery.offset - limit,
      }
      setLastCandidatesQuery(query)
      fetchCandidates(query)
    },
    [fetchCandidates, lastCandidatesQuery]
  )

  // Table limit and pagination functions for Contributors
  const fetchSameContributors = useCallback(
    (limit = API_BATCH_SIZE) => {
      const query = { ...lastContributorsQuery, limit }
      setLastContributorsQuery(query)
      fetchContributors(query)
    },
    [fetchContributors, lastContributorsQuery]
  )

  const fetchNextContributors = useCallback(
    (limit = API_BATCH_SIZE) => {
      const query = {
        ...lastContributorsQuery,
        limit,
        offset: lastContributorsQuery.offset + limit,
      }
      setLastContributorsQuery(query)
      fetchContributors(query)
    },
    [fetchContributors, lastContributorsQuery]
  )

  const fetchPreviousContributors = useCallback(
    (limit = API_BATCH_SIZE) => {
      const query = {
        ...lastContributorsQuery,
        limit,
        offset: lastContributorsQuery.offset + limit,
      }
      setLastContributorsQuery(query)
      fetchContributors(query)
    },
    [fetchContributors, lastContributorsQuery]
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
            offset={lastCandidatesQuery.offset}
            fetchSame={fetchSameCandidates}
            fetchNext={fetchNextCandidates}
            fetchPrevious={fetchPreviousCandidates}
            searchTerm={searchTerm}
            searchType="candidates"
            onChangeSort={handleCandidateSort}
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
            offset={lastContributorsQuery.offset}
            fetchSame={fetchSameContributors}
            fetchNext={fetchNextContributors}
            fetchPrevious={fetchPreviousContributors}
            searchTerm={searchTerm}
            searchType="contributors"
            onChangeSort={handleContributorsSort}
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
      contributorColumns,
      contributors,
      contributorCount,
      searchTerm,
      lastContributorsQuery,
      lastCandidatesQuery,
      fetchSameCandidates,
      fetchNextCandidates,
      fetchPreviousCandidates,
      fetchSameContributors,
      fetchNextContributors,
      fetchPreviousContributors,
      handleContributorsSort,
      handleCandidateSort,
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
