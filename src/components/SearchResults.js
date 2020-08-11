import React, { useEffect, useMemo } from 'react'
import { useParams } from 'react-router'
import { GridContainer, Alert, Accordion } from '@trussworks/react-uswds'

import { useSearch } from '../hooks/useSearch'

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

  useEffect(() => {
    if (fetchInitialSearchData) {
      fetchInitialSearchData({ searchTerm })
    }
  }, [searchTerm, fetchInitialSearchData])

  const donorColumns = useMemo(
    () => [
      {
        Header: 'Donor Name',
        accessor: 'name',
      },
      {
        Header: 'City/State',
        accessor: ({ city, state }) => city + ', ' + state,
      },
      {
        Header: 'Type',
        accessor: 'type',
      },
      {
        Header: 'Profession',
        accessor: 'profession',
      },
      {
        Header: 'Total Donations',
        accessor: 'total',
      },
    ],
    []
  )

  const candidateColumns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'candidate_full_name',
      },
      {
        Header: 'Party',
        accessor: 'party',
      },
      {
        Header: 'Contest',
        accessor: ({ office, juris }) =>
          juris ? `${office} ${juris}` : office,
      },
    ],
    []
  )

  const candidateContent = useMemo(() => {
    if (!candidates || candidateCount === 0) {
      return <p>{`No candidates found for "${searchTerm}"`}</p>
    }
    return (
      <Table columns={candidateColumns} data={candidates ? candidates : []} />
    )
  }, [candidates, candidateCount, candidateColumns, searchTerm])

  const resultsTables = useMemo(
    () => [
      {
        title: 'Candidates',
        content: candidateContent,
        expanded: true,
        id: 'candidates',
      },
      {
        title: 'Donors',
        content: <Table columns={donorColumns} data={donors ? donors : []} />,
        expanded: true,
        id: 'donors',
      },
    ],
    [donorColumns, candidateContent, donors]
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
