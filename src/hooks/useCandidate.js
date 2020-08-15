import { useCallback, useState } from 'react'
import { API_BATCH_SIZE } from '../constants'

const CANDIDATE_URL = '/api/candidate/'

const constructCandidateUrl = ({ url, candidateId, limit, offset }) => {
  candidateId = encodeURIComponent(candidateId)
  return `${url}${candidateId}?limit=${limit}&offset=${offset}`
}

const constructContributionsUrl = ({ url, candidateId, limit, offset }) => {
  candidateId = encodeURIComponent(candidateId)
  return `${url}${candidateId}/contributions?limit=${limit}&offset=${offset}`
}

export const useCandidate = () => {
  const [hasError, setHasError] = useState(false)
  const [candidate, setCandidate] = useState([])
  const [contributions, setContributions] = useState([])
  const [contributionCount, setContributionCount] = useState(0)
  const [contributionOffset, setContributionOffset] = useState(0)

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

  const fetchCandidate = useCallback(
    async ({ candidateId, limit = API_BATCH_SIZE, offset = 0 } = {}) => {
      const url = constructCandidateUrl({
        url: CANDIDATE_URL,
        candidateId,
        limit,
        offset,
      })
      try {
        const { data } = await getDataAndCount(url)
        setCandidate(data)
      } catch (e) {
        console.log(e)
      }
    },
    [getDataAndCount]
  )

  const fetchContributions = useCallback(
    async ({ candidateId, limit = API_BATCH_SIZE, offset = 0 } = {}) => {
      const url = constructContributionsUrl({
        url: CANDIDATE_URL,
        candidateId,
        limit,
        offset,
      })
      setHasError(false)
      try {
        const { data, count } = await getDataAndCount(url)
        setContributions(data)
        setContributionCount(count)
        setContributionOffset(offset)
      } catch (e) {
        console.log(e)
      }
    },
    [getDataAndCount]
  )

  const fetchInitialSearchData = useCallback(
    async ({ candidateId, limit, offset }) => {
      await fetchCandidate({ candidateId })
      await fetchContributions({ candidateId })
    },
    [fetchCandidate, fetchContributions]
  )

  return {
    hasError,
    candidate,
    contributions,
    contributionCount,
    contributionOffset,
    fetchInitialSearchData,
    fetchCandidate,
    fetchContributions,
  }
}
