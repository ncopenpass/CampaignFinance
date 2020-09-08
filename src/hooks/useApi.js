import { useCallback } from 'react'

export const useApi = () => {
  const getDataAndCount = useCallback(async (url) => {
    try {
      const { status, statusText, json } = await fetch(url)
      // fetch will almost never throw an error 🤬
      // so we need to check the status code and throw the error ourselves
      if (status >= 200 && status <= 299) {
        const { data, count } = await json()
        return { data, count }
      } else {
        throw Error(statusText)
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
