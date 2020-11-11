import { useCallback, useState } from 'react'

import { API_BATCH_SIZE, STATUSES } from '../constants'

import { useApi } from './useApi'

const CONTRIBUTORS_URL = '/api/search/contributors/'
const CANDIDATES_URL = '/api/search/candidates/'

const constructSearchUrl = ({ url, searchTerm, limit, offset, sort }) => {
  let searchUrl = `${url}${searchTerm}?limit=${limit}&offset=${offset}`
  if (sort) {
    searchUrl = `${searchUrl}&sortBy=${sort}`
  }
  return searchUrl
}

export const useSearch = () => {
  const { getDataAndCount } = useApi()
  const [hasError, setHasError] = useState(false)
  const [apiStatus, setApiStatus] = useState(STATUSES.Unsent)
  const [candidates, setCandidates] = useState([])
  const [candidateCount, setCandidateCount] = useState(0)
  const [contributors, setContributors] = useState([])
  const [contributorCount, setContributorCount] = useState(0)

  const fetchCandidates = useCallback(
    async ({ searchTerm, limit = API_BATCH_SIZE, offset = 0, sort } = {}) => {
      const url = constructSearchUrl({
        url: CANDIDATES_URL,
        searchTerm,
        limit,
        offset,
        sort,
      })
      setHasError(false)
      try {
        setApiStatus(STATUSES.Pending)
        const { data, count } = await getDataAndCount(url)
        setApiStatus(STATUSES.Success)
        setCandidates(data)
        setCandidateCount(count)
      } catch (e) {
        console.log(e)
        setApiStatus(STATUSES.Fail)
        setHasError(true)
      }
    },
    [getDataAndCount]
  )

  const fetchContributors = useCallback(
    async ({ searchTerm, limit = API_BATCH_SIZE, offset = 0, sort } = {}) => {
      const url = constructSearchUrl({
        url: CONTRIBUTORS_URL,
        searchTerm,
        limit,
        offset,
        sort,
      })
      setHasError(false)
      try {
        setApiStatus(STATUSES.Pending)
        const { data, count } = await getDataAndCount(url)
        setApiStatus(STATUSES.Success)
        setContributors(data)
        setContributorCount(count)
      } catch (e) {
        console.log(e)
        setApiStatus(STATUSES.Fail)
        setHasError(true)
      }
    },
    [getDataAndCount]
  )

  const fetchInitialSearchData = useCallback(
    async ({ searchTerm, limit, offset, sort }) => {
      await fetchCandidates({ searchTerm, limit, offset, sort })
      await fetchContributors({ searchTerm, limit, offset, sort })
    },
    [fetchCandidates, fetchContributors]
  )

  return {
    apiStatus,
    hasError,
    candidates,
    candidateCount,
    contributors,
    contributorCount,
    fetchInitialSearchData,
    fetchCandidates,
    fetchContributors,
  }
}
