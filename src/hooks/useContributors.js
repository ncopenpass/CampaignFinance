import { useCallback, useEffect, useState } from 'react'
import { API_BATCH_SIZE, STATUSES } from '../constants'

const CONTRIBUTOR_URL = '/api/contributor/'

const constructContributorUrl = ({ url, contributorId, limit, offset }) => {
  contributorId = encodeURIComponent(contributorId)
  return `${url}${contributorId}?limit=${limit}&offset=${offset}`
}

const constructContributorContributionsUrl = ({
  url,
  contributorId,
  limit,
  offset,
  sort,
  filters = [],
}) => {
  contributorId = encodeURIComponent(contributorId)
  let contributionsUrl = `${url}${contributorId}/contributions?limit=${limit}&offset=${offset}`
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

export const useContributors = () => {
  const [hasError, setHasError] = useState(false)
  const [apiStatus, setApiStatus] = useState(STATUSES.Unsent)
  const [contributor, setContributor] = useState([])
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

  const fetchContributor = useCallback(
    async ({ contributorId, limit = API_BATCH_SIZE, offset = 0 } = {}) => {
      const url = constructContributorUrl({
        url: CONTRIBUTOR_URL,
        contributorId,
        limit,
        offset,
      })
      try {
        const { data } = await getDataCountSummary(url)
        setContributor(data)
      } catch (e) {
        console.log(e)
      }
    },
    [getDataCountSummary]
  )

  const fetchContributorContributions = useCallback(
    async ({
      contributorId,
      limit = API_BATCH_SIZE,
      offset = 0,
      sort,
      filters,
    } = {}) => {
      const url = constructContributorContributionsUrl({
        url: CONTRIBUTOR_URL,
        contributorId,
        limit,
        offset,
        sort,
        filters,
      })
      try {
        const { data, count, summary } = await getDataCountSummary(url)
        setContributions(data)
        setContributionCount(count)
        setSummary(summary)
        setContributionOffset(offset)
      } catch (e) {
        console.log(e)
      }
    },
    [getDataCountSummary]
  )

  const fetchInitialSearchData = useCallback(
    async ({ contributorId, limit, offset, sort, filters }) => {
      await fetchContributor({ contributorId })
      await fetchContributorContributions({
        contributorId,
        limit,
        offset,
        sort,
        filters,
      })
    },
    [fetchContributor, fetchContributorContributions]
  )

  return {
    hasError,
    apiStatus,
    contributor,
    contributions,
    summary,
    contributionCount,
    contributionOffset,
    fetchInitialSearchData,
    fetchContributor,
    fetchContributorContributions,
  }
}

export const useGetContributorContributionYears = (contributorId = '') => {
  const [years, setYears] = useState([])
  const [status, setStatus] = useState(STATUSES.Unsent)

  useEffect(() => {
    if (!contributorId) {
      return
    }
    setStatus(STATUSES.Pending)
    async function fetchYears() {
      try {
        const result = await fetch(
          `${CONTRIBUTOR_URL}${contributorId}/contributions/years`
        )
        const body = await result.json()
        setYears(body.data.years || [])
        setStatus(STATUSES.Success)
      } catch (err) {
        console.error(err)
        setStatus(STATUSES.Fail)
      }
    }
    fetchYears()
  }, [contributorId])
  return { years, status }
}
