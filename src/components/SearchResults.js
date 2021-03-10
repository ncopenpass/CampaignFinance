import React, { useEffect, useMemo, useCallback, useState } from 'react'
import { useParams } from 'react-router'
import { GridContainer, Accordion } from '@trussworks/react-uswds'
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
    candidateApiStatus,
    contributorApiStatus,
    contributors,
    candidates,
    contributorCount,
    candidateCount,
    fetchCandidates,
    fetchContributors,
    fetchInitialSearchData,
  } = useSearch()

  const { searchContributorColumns, searchCandidateColumns } = useTableColumns()

  useEffect(() => {
    if (fetchInitialSearchData) {
      const query = {
        searchTerm,
        offset: 0,
        limit: API_BATCH_SIZE,
        filters: [],
      }
      setLastCandidatesQuery(query)
      setLastContributorsQuery(query)
      fetchInitialSearchData({ searchTerm })
    }
  }, [searchTerm, fetchInitialSearchData])

  const handleCandidateDataChange = useCallback(
    ({ sortBy, filters }) => {
      const sort = formatSortBy(sortBy)
      if (
        sort !== lastCandidatesQuery.sort ||
        JSON.stringify(filters) !== JSON.stringify(lastCandidatesQuery.filters)
      ) {
        const query = { ...lastCandidatesQuery, sort, filters }
        setLastCandidatesQuery(query)
        fetchCandidates(query)
      }
    },
    [fetchCandidates, lastCandidatesQuery]
  )

  const handleContributorDataChange = useCallback(
    ({ sortBy, filters }) => {
      const sort = formatSortBy(sortBy)
      if (
        sort !== lastContributorsQuery.sort ||
        JSON.stringify(filters) !==
          JSON.stringify(lastContributorsQuery.filters)
      ) {
        const query = { ...lastContributorsQuery, sort, filters }
        setLastContributorsQuery(query)
        fetchContributors(query)
      }
    },
    [fetchContributors, lastContributorsQuery]
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
            apiStatus={candidateApiStatus}
            columns={searchCandidateColumns}
            data={candidates}
            count={candidateCount}
            offset={lastCandidatesQuery.offset}
            fetchSame={fetchSameCandidates}
            fetchNext={fetchNextCandidates}
            fetchPrevious={fetchPreviousCandidates}
            searchTerm={searchTerm}
            searchType="candidates"
            onFetchData={handleCandidateDataChange}
            appliedFilters={lastCandidatesQuery.filters}
          />
        ),
        expanded: true,
        id: 'candidates',
      },
      {
        title: `Contributors (${contributorCount}) matching "${searchTerm}"`,
        content: (
          <SearchResultTable
            apiStatus={contributorApiStatus}
            columns={searchContributorColumns}
            data={contributors}
            count={contributorCount}
            offset={lastContributorsQuery.offset}
            fetchSame={fetchSameContributors}
            fetchNext={fetchNextContributors}
            fetchPrevious={fetchPreviousContributors}
            searchTerm={searchTerm}
            searchType="contributors"
            onFetchData={handleContributorDataChange}
            appliedFilters={lastContributorsQuery.filters}
          />
        ),
        expanded: true,
        id: 'contributors',
      },
    ],
    [
      candidateApiStatus,
      searchCandidateColumns,
      candidates,
      candidateCount,
      contributorApiStatus,
      searchContributorColumns,
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
      handleCandidateDataChange,
      handleContributorDataChange,
    ]
  )

  return (
    <GridContainer className="extra-width">
      <SearchBarContainer>
        <SearchBar hideQuickLinks />
      </SearchBarContainer>
      <Accordion items={resultsTables} />
    </GridContainer>
  )
})

export default SearchResults
