import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'

const CANDIDATE_URL = '/candidate/'

export const useTableColumns = () => {
  const contributorColumns = useMemo(
    () => [
      {
        Header: 'Contributor Name',
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
        Header: 'Total Contributions',
        accessor: 'total',
      },
    ],
    []
  )

  const candidateColumns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: ({ candidate_full_name, committee_sboe_id }) => (
          <Link to={CANDIDATE_URL + committee_sboe_id}>
            {' '}
            {candidate_full_name}
          </Link>
        ),
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

  const candidateContributionColumns = useMemo(
    () => [
      {
        Header: 'Contributor Name',
        accessor: 'name',
      },
      {
        Header: 'Contributor Type',
        accessor: 'transaction_type',
      },
      {
        Header: 'Amount',
        accessor: 'amount',
      },
      {
        Header: 'Contribution Type',
        accessor: 'form_of_payment',
      },
      {
        Header: 'Contribution Date',
        accessor: 'date_occurred',
      },
      {
        Header: 'Purpose',
        accessor: 'purpose',
      },
    ],
    []
  )

  return {
    contributorColumns,
    candidateColumns,
    candidateContributionColumns,
  }
}
