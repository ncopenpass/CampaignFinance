import { useCallback, useState } from 'react'

export const useApi = () => {
  const [hasError, setHasError] = useState(false)

  const getDataAndCount = useCallback(
    async (url) => {
      setHasError(false)
      try {
        const response = await fetch(url)
        const { data, count } = await response.json()
        return { data, count }
      } catch (e) {
        console.log(e)
        setHasError(true)
      }
    },
    [setHasError]
  )

  return {
    hasError,
    setHasError,
    getDataAndCount,
  }
}
