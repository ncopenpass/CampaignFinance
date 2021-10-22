import { useCallback, useState } from 'react'
import { API_BATCH_SIZE, STATUSES } from '../constants'

const COMMITTEE_URL = '/api/committee/'

const constructCommitteeUrl = ({ url, committeeId, limit, offset }) => {
  committeeId = encodeURIComponent(committeeId)
  return `${url}${committeeId}?limit=${limit}&offset=${offset}`
}

const constructContributionsUrl = ({
  url,
  committeeId,
  limit,
  offset,
  sort,
  filters,
}) => {
  committeeId = encodeURIComponent(committeeId)
  let contributionsUrl = `${url}${committeeId}/contributions?limit=${limit}&offset=${offset}`
  if (sort) {
    contributionsUrl = `${contributionsUrl}&sortBy=${sort}`
  }
  if (filters.length) {
    filters.forEach((filter) => {
      Object.keys(filter).forEach((key) => {
        contributionsUrl = `${contributionsUrl}&${key}=${filter[key]}`
      })
    })
  }
  return contributionsUrl
}

const constructSummaryUrl = ({ url, committeeId, filters }) => {
  committeeId = encodeURIComponent(committeeId)
  let summaryUrl = `${url}${committeeId}/contributions/summary`
  if (filters.length) {
    filters.forEach((filter) => {
      Object.keys(filter).forEach((key) => {
        if (summaryUrl.includes('?')) {
          summaryUrl = `${summaryUrl}&${key}=${filter[key]}`
        } else {
          summaryUrl = `${summaryUrl}?${key}=${filter[key]}`
        }
      })
    })
  }
  return summaryUrl
}

export const useCommittee = () => {
  const [apiStatus, setApiStatus] = useState(STATUSES.Unsent)
  const [committee, setCommittee] = useState([])
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
      const { data, count } = await response.json()
      setApiStatus(STATUSES.Success)
      return { data, count }
    } catch (e) {
      console.log(e)
      setApiStatus(STATUSES.Fail)
    }
  }, [])

  const fetchCommittee = useCallback(
    async ({ committeeId, limit = API_BATCH_SIZE, offset = 0 } = {}) => {
      const url = constructCommitteeUrl({
        url: COMMITTEE_URL,
        committeeId,
        limit,
        offset,
      })
      try {
        const { data } = await getDataCount(url)
        setCommittee(data)
      } catch (e) {
        console.log(e)
      }
    },
    [getDataCount]
  )

  const fetchContributions = useCallback(
    async ({
      committeeId,
      limit = API_BATCH_SIZE,
      offset = 0,
      sort,
      filters = [],
    } = {}) => {
      const url = constructContributionsUrl({
        url: COMMITTEE_URL,
        committeeId,
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
    async ({ committeeId, filters } = {}) => {
      try {
        const url = constructSummaryUrl({
          url: COMMITTEE_URL,
          committeeId,
          filters,
        })
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
    async ({ committeeId, limit, offset, sort, filters }) => {
      await fetchCommittee({ committeeId })
      await fetchContributions({ committeeId, limit, offset, sort, filters })
      await fetchSummary({ committeeId, filters })
    },
    [fetchCommittee, fetchContributions, fetchSummary]
  )

  return {
    apiStatus,
    committee,
    contributions,
    summary,
    contributionCount,
    fetchInitialSearchData,
    fetchCommittee,
    fetchContributions,
    fetchSummary,
  }
}
