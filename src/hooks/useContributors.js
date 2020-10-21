import { useCallback, useState } from 'react'
import { API_BATCH_SIZE } from '../constants'

const CONTRIBUTOR_URL = '/api/contributors/'

const constructContributorUrl = ({ url, contributorId, limit, offset }) => {
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

  const fetchInitialSearchData = useCallback(
    async ({ contributorId, limit, offset }) => {
      await fetchContributor({ contributorId })
    },
    [fetchContributor]
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
  }
}
