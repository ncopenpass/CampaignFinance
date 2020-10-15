import { useCallback, useState } from 'react'

import { API_BATCH_SIZE, ELECTION_YEAR, STATUSES } from '../constants'

import { useApi } from './useApi'

const constructQuickSearchUrl = ({ url, searchTerm, limit, offset }) =>
  `/api/${searchTerm}/${ELECTION_YEAR}?limit=${limit}&offset=${offset}`

export const useQuickSearch = () => {
  const { getDataAndCount } = useApi()
  const [hasError, setHasError] = useState(false)
  const [apiStatus, setApiStatus] = useState(STATUSES.Unsent)
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
        setApiStatus(STATUSES.Pending)
        const { data, count } = await getDataAndCount(url)
        setApiStatus(STATUSES.Success)
        setResults(data)
        setResultsCount(count)
        setResultsOffset(offset)
      } catch (e) {
        console.log(e)
        setHasError(true)
        setApiStatus(STATUSES.Fail)
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
    apiStatus,
    results,
    resultsCount,
    resultsOffset,
    fetchInitialQuickSearchData,
    fetchQuickSearchData,
  }
}
