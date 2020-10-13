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
      {
        Header: 'Employer',
        accessor: 'employer_name',
      },
    ],
    []
  )

  const candidateColumns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: ({ candidate_full_name, committee_sboe_id }) => (
          <Link
            to={(location) => ({
              pathname: CANDIDATE_URL + committee_sboe_id,
              fromPathname: location.pathname,
            })}
          >
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
        Header: 'Transaction Type',
        accessor: 'transaction_type',
      },
      {
        id: 'amount',
        Header: 'Amount',
        accessor: (r) => {
          const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          })
          return formatter.format(r.amount)
        },
      },
      {
        Header: 'Form of Payment',
        accessor: 'form_of_payment',
      },
      {
        id: 'date_occurred',
        Header: 'Contribution Date',
        accessor: (r) => {
          const d = new Date(r.date_occurred)
          return d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
          })
        },
      },
      {
        Header: 'Comment',
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
