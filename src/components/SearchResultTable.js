import React from 'react'
import styled from '@emotion/styled'
import { Button } from '@trussworks/react-uswds'

import { API_BATCH_SIZE } from '../constants'

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
  fetchNext,
  fetchPrevious,
  searchTerm,
  searchType,
}) => {
  return (
    <>
      {count ? (
        <>
          <Table columns={columns} data={data} />
          <ResultsTableFooter>
            {`${offset + 1} - ${Math.min(
              offset + API_BATCH_SIZE,
              count
            )} ${searchType} shown`}
            <div>
              <Button
                onClick={fetchPrevious}
                size="small"
                outline
                disabled={offset === 0}
              >
                Previous
              </Button>
              <Button
                onClick={fetchNext}
                style={{ marginRight: '0px' }}
                size="small"
                outline
                disabled={offset + API_BATCH_SIZE >= count}
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
