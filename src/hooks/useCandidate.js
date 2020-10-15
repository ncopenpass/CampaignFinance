import { useCallback, useState } from 'react'
import { API_BATCH_SIZE, STATUSES } from '../constants'

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
  const [apiStatus, setApiStatus] = useState(STATUSES.Unsent)
  const [candidate, setCandidate] = useState([])
  const [contributions, setContributions] = useState([])
  const [summary, setSummary] = useState([])
  const [contributionCount, setContributionCount] = useState(0)
  const [contributionOffset, setContributionOffset] = useState(0)

  const getDataCountSummary = useCallback(
    async (url) => {
      setHasError(false)
      try {
        setApiStatus(STATUSES.Pending)
        const response = await fetch(url)
        const { data, count, summary } = await response.json()
        setApiStatus(STATUSES.Success)
        return { data, count, summary }
      } catch (e) {
        console.log(e)
        setApiStatus(STATUSES.Fail)
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
    async ({ candidateId, limit = API_BATCH_SIZE, offset = 0 } = {}) => {
      const url = constructContributionsUrl({
        url: CANDIDATE_URL,
        candidateId,
        limit,
        offset,
      })
      setHasError(false)
      try {
        const { data, count, summary } = await getDataCountSummary(url)
        setContributions(data)
        setSummary(summary)
        setContributionCount(count)
        setContributionOffset(offset)
      } catch (e) {
        console.log(e)
      }
    },
    [getDataCountSummary]
  )

  const fetchInitialSearchData = useCallback(
    async ({ candidateId, limit, offset }) => {
      await fetchCandidate({ candidateId })
      await fetchContributions({ candidateId })
    },
    [fetchCandidate, fetchContributions]
  )

  return {
    apiStatus,
    hasError,
    candidate,
    contributions,
    summary,
    contributionCount,
    contributionOffset,
    fetchInitialSearchData,
    fetchCandidate,
    fetchContributions,
  }
}
