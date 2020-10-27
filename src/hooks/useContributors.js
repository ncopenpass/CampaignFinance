import { useCallback, useState } from 'react'
import { API_BATCH_SIZE } from '../constants'

const CONTRIBUTOR_URL = '/api/contributor/'
const CONTRIBUTIONS_URL = '/api/contributors/'

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
  const [contributor, setContributor] = useState([])
  const [contributions, setContributions] = useState([])
  const [summary, setSummary] = useState([])
  const [contributionCount, setContributionCount] = useState(0)
  const [contributionOffset, setContributionOffset] = useState(0)

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
        url: CONTRIBUTIONS_URL,
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

  return {
    hasError,
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
