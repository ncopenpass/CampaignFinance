import { useCallback, useState } from 'react'

const CONTRIBUTORS_URL = '/api/search/contributors/'
const CANDIDATES_URL = '/api/search/candidates/'

const constructSearchUrl = ({ url, searchTerm, limit, offset }) =>
  `${url}${searchTerm}?limit=${limit}&offset=${offset}`

export const useSearch = () => {
  const [hasError, setHasError] = useState(false)
  const [candidates, setCandidates] = useState([])
  const [candidateCount, setCandidateCount] = useState(0)
  const [donors, setDonors] = useState([])
  const [donorCount, setDonorCount] = useState(0)

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

  const fetchCandidates = useCallback(
    async ({ searchTerm, limit = 10, offset = 0 } = {}) => {
      const url = constructSearchUrl({
        url: CANDIDATES_URL,
        searchTerm,
        limit,
        offset,
      })
      try {
        const { data, count } = await getDataAndCount(url)
        setCandidates(data)
        setCandidateCount(count)
      } catch (e) {
        console.log(e)
      }
    },
    [getDataAndCount]
  )

  const fetchDonors = useCallback(
    async ({ searchTerm, limit = 10, offset = 0 } = {}) => {
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
      } catch (e) {
        console.log(e)
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
    donors,
    donorCount,
    fetchInitialSearchData,
    fetchCandidates,
    fetchDonors,
  }
}
