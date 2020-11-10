import React, { useEffect, useCallback, useMemo } from 'react'
import { useParams } from 'react-router'
import { GridContainer, Alert } from '@trussworks/react-uswds'

import { useQuickSearch, useTableColumns } from '../hooks'
import {
  API_BATCH_SIZE,
  CANDIDATES,
  CONTRIBUTORS,
  ELECTION_YEAR,
} from '../constants'

import SearchResultTable from './SearchResultTable'

const QuickSearchResults = React.memo(() => {
  const { searchTerm } = useParams()

  const {
    apiStatus,
    hasError,
    results,
    resultsCount,
    resultsOffset,
    fetchQuickSearchData,
    fetchInitialQuickSearchData,
  } = useQuickSearch()
  const { contributorColumns, candidateColumns } = useTableColumns()

  useEffect(() => {
    if (fetchInitialQuickSearchData) {
      fetchInitialQuickSearchData({ searchTerm })
    }
  }, [searchTerm, fetchInitialQuickSearchData])

  const columns = useMemo(() => {
    switch (searchTerm) {
      case CANDIDATES:
        return candidateColumns
      case CONTRIBUTORS:
        return contributorColumns
      default:
        return []
    }
  }, [searchTerm, candidateColumns, contributorColumns])

  const displaySearchTerm = useMemo(() => {
    switch (searchTerm) {
      case CANDIDATES:
        return 'Candidates'
      case CONTRIBUTORS:
        return 'Contributors'
      default:
        return ''
    }
  }, [searchTerm])

  const fetchSameResults = useCallback(
    (limit = API_BATCH_SIZE) => {
      fetchQuickSearchData({
        searchTerm,
        limit: limit,
        offset: resultsOffset,
      })
    },
    [resultsOffset, fetchQuickSearchData, searchTerm]
  )

  const fetchNextResults = useCallback(
    (limit = API_BATCH_SIZE) => {
      fetchQuickSearchData({
        searchTerm,
        limit: limit,
        offset: resultsOffset + limit,
      })
    },
    [resultsOffset, fetchQuickSearchData, searchTerm]
  )

  const fetchPreviousResults = useCallback(
    (limit = API_BATCH_SIZE) => {
      fetchQuickSearchData({
        searchTerm,
        limit: limit,
        offset: resultsOffset - limit,
      })
    },
    [resultsOffset, searchTerm, fetchQuickSearchData]
  )

  return (
    <GridContainer>
      {hasError ? (
        <Alert slim type="error">
          Error fetching quick search data
        </Alert>
      ) : (
        <>
          <h1>
            {`Quick Search Results: ${ELECTION_YEAR} ${displaySearchTerm}`}
          </h1>
          <h4>{`${resultsCount} Results`}</h4>
          <SearchResultTable
            apiStatus={apiStatus}
            columns={columns}
            data={results}
            count={resultsCount}
            offset={resultsOffset}
            fetchSame={fetchSameResults}
            fetchNext={fetchNextResults}
            fetchPrevious={fetchPreviousResults}
            searchTerm={ELECTION_YEAR}
            searchType={displaySearchTerm}
          />
        </>
      )}
    </GridContainer>
  )
})

export default QuickSearchResults
