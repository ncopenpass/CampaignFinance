import { useCallback, useState } from 'react'

import { API_BATCH_SIZE, STATUSES } from '../constants'

import { useApi } from './useApi'

const CONTRIBUTORS_URL = '/api/search/contributors/'
const CANDIDATES_URL = '/api/search/candidates/'

const constructSearchUrl = ({ url, searchTerm, limit, offset }) =>
  `${url}${searchTerm}?limit=${limit}&offset=${offset}`

export const useSearch = () => {
  const { getDataAndCount } = useApi()
  const [hasError, setHasError] = useState(false)
  const [apiStatus, setApiStatus] = useState(STATUSES.Unsent)
  const [candidates, setCandidates] = useState([])
  const [candidateCount, setCandidateCount] = useState(0)
  const [candidateOffset, setCandidateOffset] = useState(0)
  const [contributors, setContributors] = useState([])
  const [contributorCount, setContributorCount] = useState(0)
  const [contributorOffset, setContributorOffset] = useState(0)

  const fetchCandidates = useCallback(
    async ({ searchTerm, limit = API_BATCH_SIZE, offset = 0 } = {}) => {
      const url = constructSearchUrl({
        url: CANDIDATES_URL,
        searchTerm,
        limit,
        offset,
      })
      setHasError(false)
      try {
        setApiStatus(STATUSES.Pending)
        const { data, count } = await getDataAndCount(url)
        setApiStatus(STATUSES.Success)
        setCandidates(data)
        setCandidateCount(count)
        setCandidateOffset(offset)
      } catch (e) {
        console.log(e)
        setApiStatus(STATUSES.Fail)
        setHasError(true)
      }
    },
    [getDataAndCount]
  )

  const fetchContributors = useCallback(
    async ({ searchTerm, limit = API_BATCH_SIZE, offset = 0 } = {}) => {
      const url = constructSearchUrl({
        url: CONTRIBUTORS_URL,
        searchTerm,
        limit,
        offset,
      })
      setHasError(false)
      try {
        setApiStatus(STATUSES.Pending)
        const { data, count } = await getDataAndCount(url)
        setApiStatus(STATUSES.Success)
        setContributors(data)
        setContributorCount(count)
        setContributorOffset(offset)
      } catch (e) {
        console.log(e)
        setApiStatus(STATUSES.Fail)
        setHasError(true)
      }
    },
    [getDataAndCount]
  )

  const fetchInitialSearchData = useCallback(
    async ({ searchTerm, limit, offset }) => {
      await fetchCandidates({ searchTerm })
      await fetchContributors({ searchTerm })
    },
    [fetchCandidates, fetchContributors]
  )

  return {
    apiStatus,
    hasError,
    candidates,
    candidateCount,
    candidateOffset,
    contributors,
    contributorCount,
    contributorOffset,
    fetchInitialSearchData,
    fetchCandidates,
    fetchContributors,
  }
}
