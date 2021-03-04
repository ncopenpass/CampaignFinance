import React, { useState, useCallback } from 'react'
import styled from '@emotion/styled'
import { Button, Alert, Dropdown } from '@trussworks/react-uswds'

import { useTablePagination } from '../hooks'
import { STATUSES } from '../constants'

import Table from './Table'
import Spinner from './Spinner'

const ResultsTableFooter = styled.div`
  display: flex;
  justify-content: space-between;
`
const SearchResultTable = ({
  apiStatus,
  columns,
  data,
  count,
  offset,
  fetchSame,
  fetchNext,
  fetchPrevious,
  searchTerm,
  searchType,
  onFetchData,
  initialSortBy,
}) => {
  const { tableLimits } = useTablePagination()

  const [apiLimit, setApiLimit] = useState(10)

  const onChangeLimit = useCallback(
    (value) => {
      setApiLimit(value)
      fetchSame(value)
    },
    [fetchSame]
  )

  if (apiStatus === STATUSES.Unsent) {
    return <Spinner />
  } else if (apiStatus === STATUSES.Fail) {
    return (
      <Alert slim type="error">
        Error fetching search data
      </Alert>
    )
  } else if (apiStatus === STATUSES.Success && count === 0) {
    return <p>{`No ${searchType} found for "${searchTerm}"`}</p>
  } else {
    return (
      <>
        <Dropdown
          value={apiLimit}
          onChange={(e) => onChangeLimit(e.currentTarget.value)}
        >
          {tableLimits.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Dropdown>
        <Table
          columns={columns}
          data={data}
          onFetchData={onFetchData}
          initialSortBy={initialSortBy}
          isLoading={apiStatus === STATUSES.Pending}
        />
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
    )
  }
}

export default SearchResultTable
