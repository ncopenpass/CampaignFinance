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
    hasError,
    results,
    resultsCount,
    resultsOffset,
    fetchQuickSearchData,
    fetchInitialQuickSearchData,
  } = useQuickSearch()
  const { donorColumns, candidateColumns } = useTableColumns()

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
        return donorColumns
      default:
        return []
    }
  }, [searchTerm, candidateColumns, donorColumns])

  const displaySearchTerm = useMemo(() => {
    switch (searchTerm) {
      case CANDIDATES:
        return 'Candidates'
      case CONTRIBUTORS:
        return 'Donors'
      default:
        return ''
    }
  }, [searchTerm])

  const fetchNextResults = useCallback(() => {
    fetchQuickSearchData({
      searchTerm,
      offset: resultsOffset + API_BATCH_SIZE,
    })
  }, [resultsOffset, fetchQuickSearchData, searchTerm])

  const fetchPreviousResults = useCallback(() => {
    fetchQuickSearchData({
      searchTerm,
      offset: resultsOffset - API_BATCH_SIZE,
    })
  }, [resultsOffset, searchTerm, fetchQuickSearchData])

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
          <h4>
            <>{`${resultsCount} Results`}</>
          </h4>
          <SearchResultTable
            columns={columns}
            data={results}
            count={resultsCount}
            offset={resultsOffset}
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
