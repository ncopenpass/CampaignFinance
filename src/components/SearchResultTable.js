import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import { Button, Dropdown } from '@trussworks/react-uswds'

import { useTablePagination } from '../hooks'

import Table from './Table'

const ResultsTableFooter = styled.div`
  display: flex;
  justify-content: space-between;
`

const SearchResultTable = ({
  columns,
  data,
  count,
  offset,
  fetchSame,
  fetchNext,
  fetchPrevious,
  searchTerm,
  searchType,
}) => {
  const { tableLimits } = useTablePagination()

  const [apiLimit, setApiLimit] = useState(10)

  useEffect(() => {
    async function updateLimit() {
      await fetchSame(apiLimit)
    }
    updateLimit()
  }, [apiLimit, fetchSame])

  return (
    <>
      {count ? (
        <>
          <Dropdown
            value={apiLimit}
            onChange={(e) => setApiLimit(e.currentTarget.value)}
          >
            {tableLimits.map(({ label, value }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Dropdown>
          <Table columns={columns} data={data} />
          <ResultsTableFooter>
            {`${offset + 1} - ${Math.min(
              offset + apiLimit,
              count
            )} ${searchType} shown`}
            <div>
              <Button
                onClick={() => fetchPrevious(apiLimit)}
                size="small"
                outline
                disabled={offset === 0}
              >
                Previous
              </Button>
              <Button
                onClick={() => fetchNext(apiLimit)}
                style={{ marginRight: '0px' }}
                size="small"
                outline
                disabled={offset + apiLimit >= count}
              >
                Next
              </Button>
            </div>
          </ResultsTableFooter>
        </>
      ) : (
        <p>{`No ${searchType} found for "${searchTerm}"`}</p>
      )}
    </>
  )
}

export default SearchResultTable
