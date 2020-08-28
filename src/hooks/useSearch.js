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
  const [candidates, setCandidates] = useState([])
  const [candidateCount, setCandidateCount] = useState(0)
  const [candidateOffset, setCandidateOffset] = useState(0)
  const [donors, setDonors] = useState([])
  const [donorCount, setDonorCount] = useState(0)
  const [donorOffset, setDonorOffset] = useState(0)

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
        const { data, count } = await getDataAndCount(url)
        setCandidates(data)
        setCandidateCount(count)
        setCandidateOffset(offset)
      } catch (e) {
        console.log(e)
        setHasError(true)
      }
    },
    [getDataAndCount]
  )

  const fetchDonors = useCallback(
    async ({ searchTerm, limit = API_BATCH_SIZE, offset = 0 } = {}) => {
      const url = constructSearchUrl({
        url: CONTRIBUTORS_URL,
        searchTerm,
        limit,
        offset,
      })
      setHasError(false)
      try {
        const { data, count } = await getDataAndCount(url)
        setDonors(data)
        setDonorCount(count)
        setDonorOffset(offset)
      } catch (e) {
        console.log(e)
        setHasError(true)
      }
    },
    [getDataAndCount]
  )

  const fetchInitialSearchData = useCallback(
    async ({ searchTerm, limit, offset }) => {
      await fetchCandidates({ searchTerm })
      await fetchDonors({ searchTerm })
    },
    [fetchCandidates, fetchDonors]
  )

  return {
    hasError,
    candidates,
    candidateCount,
    candidateOffset,
    donors,
    donorCount,
    donorOffset,
    fetchInitialSearchData,
    fetchCandidates,
    fetchDonors,
  }
}
