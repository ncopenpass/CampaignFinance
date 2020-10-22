import { useCallback, useState } from 'react'
import { API_BATCH_SIZE } from '../constants'

const CANDIDATE_URL = '/api/candidate/'

const constructCandidateUrl = ({ url, candidateId, limit, offset }) => {
  candidateId = encodeURIComponent(candidateId)
  return `${url}${candidateId}?limit=${limit}&offset=${offset}`
}

const constructContributionsUrl = ({
  url,
  candidateId,
  limit,
  offset,
  sort,
}) => {
  candidateId = encodeURIComponent(candidateId)
  let contributionsUrl = `${url}${candidateId}/contributions?limit=${limit}&offset=${offset}`
  if (sort) {
    contributionsUrl = `${contributionsUrl}&sortBy=${sort}`
  }
  return contributionsUrl
}

export const useCandidate = () => {
  const [hasError, setHasError] = useState(false)
  const [candidate, setCandidate] = useState([])
  const [contributions, setContributions] = useState([])
  const [summary, setSummary] = useState([])
  const [contributionCount, setContributionCount] = useState(0)

  const getDataCountSummary = useCallback(
    async (url) => {
      setHasError(false)
      try {
        const response = await fetch(url)
        const { data, count, summary } = await response.json()
        return { data, count, summary }
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
        const { data } = await getDataCountSummary(url)
        setCandidate(data)
      } catch (e) {
        console.log(e)
      }
    },
    [getDataCountSummary]
  )

  const fetchContributions = useCallback(
    async ({ candidateId, limit = API_BATCH_SIZE, offset = 0, sort } = {}) => {
      const url = constructContributionsUrl({
        url: CANDIDATE_URL,
        candidateId,
        limit,
        offset,
        sort,
      })
      setHasError(false)
      try {
        const { data, count, summary } = await getDataCountSummary(url)
        setContributions(data)
        setSummary(summary)
        setContributionCount(count)
      } catch (e) {
        console.log(e)
      }
    },
    [getDataCountSummary]
  )

  const fetchInitialSearchData = useCallback(
    async ({ candidateId, limit, offset, sort }) => {
      await fetchCandidate({ candidateId })
      await fetchContributions({ candidateId, limit, offset, sort })
    },
    [fetchCandidate, fetchContributions]
  )

  return {
    hasError,
    candidate,
    contributions,
    summary,
    contributionCount,
    fetchInitialSearchData,
    fetchCandidate,
    fetchContributions,
  }
}
