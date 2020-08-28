import { useCallback } from 'react'

export const useApi = () => {
  const getDataAndCount = useCallback(async (url) => {
    // consumers of this function should surround calls in a try catch block
    // this function does NOT catch its own errors
    const response = await fetch(url)
    const { data, count } = await response.json()
    return { data, count }
  }, [])

  return {
    getDataAndCount,
  }
}
