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
  const [candidates, setCandidates] = useState([])
  const [candidateCount, setCandidateCount] = useState(0)
  const [candidateApiStatus, setCandidateApiStatus] = useState(STATUSES.Unsent)
  const [contributors, setContributors] = useState([])
  const [contributorCount, setContributorCount] = useState(0)
  const [contributorApiStatus, setContributorApiStatus] = useState(
    STATUSES.Unsent
  )

  const fetchCandidates = useCallback(
    async ({ searchTerm, limit = API_BATCH_SIZE, offset = 0, sort } = {}) => {
      const url = constructSearchUrl({
        url: CANDIDATES_URL,
        searchTerm,
        limit,
        offset,
        sort,
      })
      try {
        setCandidateApiStatus(STATUSES.Pending)
        const { data, count } = await getDataAndCount(url)
        setCandidateApiStatus(STATUSES.Success)
        setCandidates(data)
        setCandidateCount(count)
      } catch (e) {
        console.log(e)
        setCandidateApiStatus(STATUSES.Fail)
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
      try {
        setContributorApiStatus(STATUSES.Pending)
        const { data, count } = await getDataAndCount(url)
        setContributorApiStatus(STATUSES.Success)
        setContributors(data)
        setContributorCount(count)
      } catch (e) {
        console.log(e)
        setContributorApiStatus(STATUSES.Fail)
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
    candidateApiStatus,
    candidates,
    candidateCount,
    contributorApiStatus,
    contributors,
    contributorCount,
    fetchInitialSearchData,
    fetchCandidates,
    fetchContributors,
  }
}
