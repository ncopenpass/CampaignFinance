import React, { useEffect, useCallback } from 'react'
import { useParams } from 'react-router'
import { GridContainer, Alert } from '@trussworks/react-uswds'

import { useQuickSearch, useTableColumns } from '../hooks'
import { API_BATCH_SIZE, CANDIDATES } from '../constants'

import SearchResultTable from './SearchResultTable'

const quickSearchDisplayMap = {
  candidates: 'Candidates',
  contributors: 'Donors',
}

const SearchResults = React.memo(() => {
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
            {`Quick Search Results: 2020 ${quickSearchDisplayMap[searchTerm]}`}
          </h1>
          <h4>
            <>{`${resultsCount} Results`}</>
          </h4>
          <SearchResultTable
            columns={
              searchTerm === CANDIDATES ? candidateColumns : donorColumns
            }
            data={results}
            count={resultsCount}
            offset={resultsOffset}
            fetchNext={fetchNextResults}
            fetchPrevious={fetchPreviousResults}
            searchTerm="2020"
            searchType={searchTerm ? quickSearchDisplayMap[searchTerm] : ''}
          />
        </>
      )}
    </GridContainer>
  )
})

export default SearchResults
