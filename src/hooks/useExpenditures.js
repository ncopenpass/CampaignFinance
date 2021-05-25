import { useCallback, useState } from 'react'
import { API_BATCH_SIZE, STATUSES } from '../constants'

const EXPENDITURES_URL = 'api/expenditures/'

const constructExpendituresUrl = ({ ncsbeID, limit, offset, sort }) => {
  let expendituresUrl = `${EXPENDITURES_URL}${encodeURIComponent(
    ncsbeID
  )}?limit=${limit}&offset=${offset}`
  if (sort) {
    expendituresUrl = `${expendituresUrl}&sortBy=${sort}`
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
      const response = await fetch(url)
      const { data, count } = await response.json()
      setApiStatus(STATUSES.Success)
      return { data, count }
    } catch (e) {
      console.log(e)
      setApiStatus(STATUSES.Fail)
    }
  }, [])

  const fetchExpenditures = useCallback(
    async ({ ncsbeID, limit = API_BATCH_SIZE, offset = 0, sort } = {}) => {
      const url = constructExpendituresUrl({ ncsbeID, limit, offset, sort })
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
