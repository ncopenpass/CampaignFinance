import { useCallback, useState } from 'react'
import { API_BATCH_SIZE, STATUSES } from '../constants'

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
  filters,
}) => {
  candidateId = encodeURIComponent(candidateId)
  let contributionsUrl = `${url}${candidateId}/contributions?limit=${limit}&offset=${offset}`
  if (sort) {
    contributionsUrl = `${contributionsUrl}&sortBy=${sort}`
  }
  if (filters.length) {
    filters.forEach(({ id, value }) => {
      contributionsUrl = `${contributionsUrl}&${id}=${value}`
    })
  }
  return contributionsUrl
}

export const useCandidate = () => {
  const [apiStatus, setApiStatus] = useState(STATUSES.Unsent)
  const [candidate, setCandidate] = useState([])
  const [contributions, setContributions] = useState([])
  // Give the summary default values, to avoid using a spinner or doing a check
  const [summary, setSummary] = useState({
    sum: '-',
    avg: '-',
    max: '-',
    count: '-',
    aggregated_contributions_count: '-',
    aggregated_contributions_sum: '-',
  })
  const [contributionCount, setContributionCount] = useState(0)

  const getDataCount = useCallback(async (url) => {
    try {
      setApiStatus(STATUSES.Pending)
      const response = await fetch(url)
      const { data, count, summary } = await response.json()
      setApiStatus(STATUSES.Success)
      return { data, count, summary }
    } catch (e) {
      console.log(e)
      setApiStatus(STATUSES.Fail)
    }
  }, [])

  const fetchCandidate = useCallback(
    async ({ candidateId, limit = API_BATCH_SIZE, offset = 0 } = {}) => {
      const url = constructCandidateUrl({
        url: CANDIDATE_URL,
        candidateId,
        limit,
        offset,
      })
      try {
        const { data } = await getDataCount(url)
        setCandidate(data)
      } catch (e) {
        console.log(e)
      }
    },
    [getDataCount]
  )

  const fetchContributions = useCallback(
    async ({
      candidateId,
      limit = API_BATCH_SIZE,
      offset = 0,
      sort,
      filters = [],
    } = {}) => {
      const url = constructContributionsUrl({
        url: CANDIDATE_URL,
        candidateId,
        limit,
        offset,
        sort,
        filters,
      })
      try {
        const { data, count } = await getDataCount(url)
        setContributions(data)
        setContributionCount(count)
      } catch (e) {
        console.log(e)
      }
    },
    [getDataCount]
  )

  const fetchSummary = useCallback(
    async ({ candidateId } = {}) => {
      try {
        const url = `${CANDIDATE_URL}${candidateId}/contributions/summary`
        const response = await fetch(url)
        const body = await response.json()
        setSummary(body.data)
      } catch (e) {
        console.log(e)
      }
    },
    [setSummary]
  )

  const fetchInitialSearchData = useCallback(
    async ({ candidateId, limit, offset, sort }) => {
      await fetchCandidate({ candidateId })
      await fetchContributions({ candidateId, limit, offset, sort })
      await fetchSummary({ candidateId })
    },
    [fetchCandidate, fetchContributions, fetchSummary]
  )

  return {
    apiStatus,
    candidate,
    contributions,
    summary,
    contributionCount,
    fetchInitialSearchData,
    fetchCandidate,
    fetchContributions,
    fetchSummary,
  }
}
