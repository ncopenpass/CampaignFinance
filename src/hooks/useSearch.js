import { useCallback, useState } from 'react'

import { API_BATCH_SIZE } from '../constants'

import { useApi } from './useApi'

const CONTRIBUTORS_URL = '/api/search/contributors/'
const CANDIDATES_URL = '/api/search/candidates/'

const constructSearchUrl = ({ url, searchTerm, limit, offset }) =>
  `${url}${searchTerm}?limit=${limit}&offset=${offset}`

export const useSearch = () => {
  const { getDataAndCount } = useApi()
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
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
        setIsLoading(true)
        const { data, count } = await getDataAndCount(url)
        setCandidates(data)
        setCandidateCount(count)
        setCandidateOffset(offset)
      } catch (e) {
        console.log(e)
        setHasError(true)
      } finally {
        setIsLoading(false)
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
        setIsLoading(true)
        const { data, count } = await getDataAndCount(url)
        setContributors(data)
        setContributorCount(count)
        setContributorOffset(offset)
      } catch (e) {
        console.log(e)
        setHasError(true)
      } finally {
        setIsLoading(false)
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
    isLoading,
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
