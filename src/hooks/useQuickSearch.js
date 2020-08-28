import { useCallback, useState } from 'react'
import { API_BATCH_SIZE } from '../constants'

const constructQuickSearchUrl = ({ url, searchTerm, limit, offset }) =>
  `/api/${searchTerm}/2020?limit=${limit}&offset=${offset}`

export const useQuickSearch = () => {
  const [hasError, setHasError] = useState(false)
  const [results, setResults] = useState([])
  const [resultsCount, setResultsCount] = useState(0)
  const [resultsOffset, setResultsOffset] = useState(0)

  const getDataAndCount = useCallback(
    async (url) => {
      setHasError(false)
      try {
        const response = await fetch(url)
        const { data, count } = await response.json()
        return { data, count }
      } catch (e) {
        console.log(e)
        setHasError(true)
      }
    },
    [setHasError]
  )

  const fetchQuickSearchData = useCallback(
    async ({ searchTerm, limit = API_BATCH_SIZE, offset = 0 } = {}) => {
      const url = constructQuickSearchUrl({
        searchTerm,
        limit,
        offset,
      })
      setHasError(false)
      try {
        const { data, count } = await getDataAndCount(url)
        setResults(data)
        setResultsCount(count)
        setResultsOffset(offset)
      } catch (e) {
        console.log(e)
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
    results,
    resultsCount,
    resultsOffset,
    fetchInitialQuickSearchData,
    fetchQuickSearchData,
  }
}
