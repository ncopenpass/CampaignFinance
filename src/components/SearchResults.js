import React, { useEffect, useMemo } from 'react'
import { useParams } from 'react-router'
import { GridContainer, Alert, Accordion } from '@trussworks/react-uswds'

import { useSearch, useTableColumns } from '../hooks'

import Table from './Table'

const SearchResults = () => {
  let { searchTerm } = useParams()
  const {
    hasError,
    donors,
    candidates,
    donorCount,
    candidateCount,
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
          <Table
            columns={candidateColumns}
            data={candidates}
            count={candidateCount}
          />
        ) : (
          <p>{`No candidates found for "${searchTerm}"`}</p>
        ),
        expanded: true,
        id: 'candidates',
      },
      {
        title: `Donors (${donorCount}) matching "${searchTerm}"`,
        content: donorCount ? (
          <Table columns={donorColumns} data={donors} count={donorCount} />
        ) : (
          <p>{`No donors found for "${searchTerm}"`}</p>
        ),
        expanded: true,
        id: 'donors',
      },
    ],
    [
      candidateColumns,
      candidates,
      candidateCount,
      donorColumns,
      donors,
      donorCount,
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
        <Accordion items={resultsTables} />
      )}
    </GridContainer>
  )
}

export default SearchResults
