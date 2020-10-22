import { useMemo } from 'react'

export const useTablePagination = () => {
  const tableLimits = useMemo(
    () => [
      {
        label: 'Show 10',
        value: '10',
      },
      {
        label: 'Show 25',
        value: '25',
      },
      {
        label: 'Show 50',
        value: '50',
      },
      {
        label: 'Show 100',
        value: '100',
      },
    ],
    []
  )

  return {
    tableLimits,
  }
}
