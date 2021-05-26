import { useCallback, useState } from 'react'
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
}) => {
  contributorId = encodeURIComponent(contributorId)
  return `${url}${contributorId}/contributions?limit=${limit}&offset=${offset}`
}

export const useContributors = () => {
  const [hasError, setHasError] = useState(false)
  const [apiStatus, setApiStatus] = useState(STATUSES.Unsent)
  const [contributor, setContributor] = useState([])
  const [contributions, setContributions] = useState([])
  const [summary, setSummary] = useState([])
  const [contributionCount, setContributionCount] = useState(0)
  const [contributionOffset, setContributionOffset] = useState(0)
  const [total, setTotal] = useState({
    total: '-',
  })

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
    async ({ contributorId, limit = API_BATCH_SIZE, offset = 0 } = {}) => {
      const url = constructContributorContributionsUrl({
        url: CONTRIBUTOR_URL,
        contributorId,
        limit,
        offset,
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
    async ({ contributorId, limit, offset }) => {
      await fetchContributor({ contributorId })
      await fetchContributorContributions({ contributorId })
    },
    [fetchContributor, fetchContributorContributions]
  )

  const fetchTotal = useCallback(
    async ({ contributorId } = {}) => {
      try {
        const url = `${CONTRIBUTOR_URL}${contributorId}/contributions/total`
        const response = await fetch(url)
        const body = await response.json()
        setTotal(body.data)
      } catch (e) {
        console.log(e)
      }
    },
    [setTotal]
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
    fetchTotal,
  }
}
