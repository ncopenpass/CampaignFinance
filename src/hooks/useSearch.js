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

  const fetchCandidates = useCallback(
    async ({ searchTerm, limit = 10, offset = 0 } = {}) => {
      const url = constructSearchUrl({
        url: CANDIDATES_URL,
        searchTerm,
        limit,
        offset,
      })
      setHasError(false)
      try {
        // const { count, data } = (await fetch(url)).json();
        const response = await fetch(url)
        const responseData = await response.json()
        const { data, count } = responseData
        setCandidates(data)
        setCandidateCount(count)
      } catch (e) {
        console.log(e)
        setHasError(true)
      }
    },
    []
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
        const { count, data } = (await fetch(url)).json()
        setDonors(data)
        setDonorCount(count)
      } catch (e) {
        console.log(e)
        setHasError(true)
      }
    },
    []
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
