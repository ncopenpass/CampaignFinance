import React, { useEffect, useMemo } from 'react'
import { useParams } from 'react-router'
import {
  GridContainer,
  Alert,
  Accordion,
  Button,
} from '@trussworks/react-uswds'
import styled from '@emotion/styled'

import { useSearch, useTableColumns } from '../hooks'
import { API_BATCH_SIZE } from '../constants'

import Table from './Table'
import SearchBar from './SearchBar'

const SearchBarContainer = styled.div`
  padding: 20px 0px;
`

const ResultsTableFooter = styled.div`
  display: flex;
  justify-content: space-between;
`

const SearchResults = React.memo(() => {
  let { searchTerm } = useParams()
  const {
    hasError,
    donors,
    candidates,
    donorCount,
    candidateCount,
    donorOffset,
    candidateOffset,
    fetchInitialSearchData,
  } = useSearch()
  const { donorColumns, candidateColumns } = useTableColumns()

  useEffect(() => {
    if (fetchInitialSearchData) {
      fetchInitialSearchData({ searchTerm })
    }
  }, [searchTerm, fetchInitialSearchData])

  const resultsTables = useMemo(
    () => [
      {
        title: `Candidates (${candidateCount}) matching "${searchTerm}"`,
        content: candidateCount ? (
          <>
            <Table
              columns={candidateColumns}
              data={candidates}
              count={candidateCount}
            />
            <ResultsTableFooter>
              {`${candidateOffset + 1} - ${Math.min(
                candidateOffset + API_BATCH_SIZE,
                candidateCount
              )} candidates shown`}
              <div>
                <Button size="small" outline disabled={candidateOffset === 0}>
                  Previous
                </Button>
                <Button
                  style={{ marginRight: '0px' }}
                  size="small"
                  outline
                  disabled={candidateOffset + API_BATCH_SIZE >= candidateCount}
                >
                  Next
                </Button>
              </div>
            </ResultsTableFooter>
          </>
        ) : (
          <p>{`No candidates found for "${searchTerm}"`}</p>
        ),
        expanded: true,
        id: 'candidates',
      },
      // {
      //   title: `Donors (${donorCount}) matching "${searchTerm}"`,
      //   content: donorCount ? (
      //     <>
      //       <Table columns={donorColumns} data={donors} count={donorCount} />
      //       <div>
      //         {`${donorOffset} - ${Math.min(
      //           donorOffset + API_BATCH_SIZE,
      //           donorCount
      //         )} donors shown`}
      //       </div>
      //     </>
      //   ) : (
      //     <p>{`No donors found for "${searchTerm}"`}</p>
      //   ),
      //   expanded: true,
      //   id: 'donors',
      // },
    ],
    [
      candidateColumns,
      candidates,
      candidateCount,
      candidateOffset,
      donorColumns,
      donors,
      donorCount,
      donorOffset,
      searchTerm,
    ]
  )

  return (
    <GridContainer>
      {hasError ? (
        <Alert slim type="error">
          Error fetching search data
        </Alert>
      ) : (
        <>
          <SearchBarContainer>
            <SearchBar hideQuickLinks />
          </SearchBarContainer>
          <Accordion items={resultsTables} />
        </>
      )}
    </GridContainer>
  )
})

export default SearchResults
