import { useCallback, useState } from 'react'

import { API_BATCH_SIZE, ELECTION_YEAR } from '../constants'

import { useApi } from './useApi'

const constructQuickSearchUrl = ({ url, searchTerm, limit, offset }) =>
  `/api/${searchTerm}/${ELECTION_YEAR}?limit=${limit}&offset=${offset}`

export const useQuickSearch = () => {
  const { getDataAndCount } = useApi()
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState([])
  const [resultsCount, setResultsCount] = useState(0)
  const [resultsOffset, setResultsOffset] = useState(0)

  const fetchQuickSearchData = useCallback(
    async ({ searchTerm, limit = API_BATCH_SIZE, offset = 0 } = {}) => {
      const url = constructQuickSearchUrl({
        searchTerm,
        limit,
        offset,
      })
      setHasError(false)
      try {
        setIsLoading(true)
        const { data, count } = await getDataAndCount(url)
        setResults(data)
        setResultsCount(count)
        setResultsOffset(offset)
      } catch (e) {
        console.log(e)
        setHasError(true)
      } finally {
        setIsLoading(false)
      }
    },
    [getDataAndCount]
  )

  const fetchInitialQuickSearchData = useCallback(
    async ({ searchTerm, limit, offset }) => {
      await fetchQuickSearchData({ searchTerm })
    },
    [fetchQuickSearchData]
  )

  return {
    hasError,
    isLoading,
    results,
    resultsCount,
    resultsOffset,
    fetchInitialQuickSearchData,
    fetchQuickSearchData,
  }
}
