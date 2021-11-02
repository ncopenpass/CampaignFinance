import { useCallback, useState } from 'react'
import { API_BATCH_SIZE, STATUSES } from '../constants'

const EXPENDITURES_URL = 'api/expenditures/'

const constructExpendituresUrl = ({
  ncsbeID,
  limit,
  offset,
  sort,
  filters,
}) => {
  let expendituresUrl = `${EXPENDITURES_URL}${encodeURIComponent(
    ncsbeID
  )}?limit=${limit}&offset=${offset}`
  if (sort) {
    expendituresUrl = `${expendituresUrl}&sortBy=${sort}`
  }
  if (filters.length) {
    filters.forEach((filter) => {
      Object.keys(filter).forEach((key) => {
        expendituresUrl = `${expendituresUrl}&${key}=${filter[key]}`
      })
    })
  }
  return expendituresUrl
}

export const useExpenditures = () => {
  const [apiStatus, setApiStatus] = useState(STATUSES.Unsent)
  const [expenditures, setExpenditures] = useState([])
  const [expenditureCount, setExpenditureCount] = useState([])

  const getDataAndCount = useCallback(async (url) => {
    try {
      setApiStatus(STATUSES.Pending)
      const response = await fetch(`${window.location.origin}/${url}`)
      const { data, count } = await response.json()
      setApiStatus(STATUSES.Success)
      return { data, count }
    } catch (e) {
      console.log(e)
      setApiStatus(STATUSES.Fail)
    }
  }, [])

  const fetchExpenditures = useCallback(
    async ({
      ncsbeID,
      limit = API_BATCH_SIZE,
      offset = 0,
      sort,
      filters,
    } = {}) => {
      const url = constructExpendituresUrl({
        ncsbeID,
        limit,
        offset,
        sort,
        filters,
      })
      try {
        const { data, count } = await getDataAndCount(url)
        setExpenditures(data)
        setExpenditureCount(count)
      } catch (e) {
        console.log(e)
      }
    },
    [getDataAndCount]
  )

  return {
    apiStatus,
    expenditures,
    expenditureCount,
    fetchExpenditures,
  }
}
