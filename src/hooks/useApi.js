import { useCallback } from 'react'

export const useApi = () => {
  const getDataAndCount = useCallback(async (url) => {
    try {
      const res = await fetch(url)
      // fetch will almost never throw an error 🤬
      // so we need to check the status code and throw the error ourselves
      if (res.status >= 200 && res.status <= 299) {
        const { data, count } = await res.json()
        return { data, count }
      } else {
        throw Error(res.statusText)
      }
    } catch (e) {
      // catch network related errors here
      throw e
    }
  }, [])

  return {
    getDataAndCount,
  }
}
