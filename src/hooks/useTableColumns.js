import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'

const CANDIDATE_URL = '/candidate/'
const CONTRIBUTOR_URL = '/contributors/'

export const useTableColumns = () => {
  const contributorColumns = useMemo(
    () => [
      {
        Header: 'Contributor Name',
        accessor: ({ contributor_id, name }) => (
          <Link
            to={(location) => ({
              pathname: CONTRIBUTOR_URL + contributor_id,
              fromPathname: location.pathname,
            })}
          >
            {' '}
            {name}
          </Link>
        ),
      },
      {
        Header: 'City/State',
        accessor: ({ city, state }) => city + ', ' + state,
        disableSortBy: true,
      },
      {
        Header: 'Type',
        accessor: 'type',
        disableSortBy: true,
      },
      {
        Header: 'Profession',
        accessor: 'profession',
        disableSortBy: true,
      },
      {
        Header: 'Total Contributions',
        accessor: 'total',
        disableSortBy: true,
      },
      {
        Header: 'Employer',
        accessor: 'employer_name',
        disableSortBy: true,
      },
    ],
    []
  )

  const individualContributionsColumns = useMemo(
    () => [
      {
        Header: 'Recipient Name',
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
        Header: 'Donation Type',
        accessor: 'transaction_type',
      },
      {
        Header: 'Donation Date',
        accessor: 'date_occurred',
      },
      {
        Header: 'Description',
        accessor: 'purpose',
      },
      {
        Header: 'Total Contributed',
        accessor: (r) => {
          const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          })
          return formatter.format(r.total_contributions_to_committee)
        },
      },
    ],
    []
  )

  const candidateColumns = useMemo(
    () => [
      {
        Header: 'Name',
        id: 'candidate_full_name',
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
        disableSortBy: true,
      },
      {
        Header: 'Contest',
        accessor: ({ office, juris }) =>
          juris ? `${office} ${juris}` : office,
        disableSortBy: true,
      },
    ],
    []
  )

  const candidateContributionColumns = useMemo(
    () => [
      {
        Header: 'Contributor Name',
        accessor: ({ contributor_id, name }) => (
          <Link
            to={(location) => ({
              pathname: CONTRIBUTOR_URL + contributor_id,
              fromPathname: location.pathname,
            })}
          >
            {' '}
            {name}
          </Link>
        ),
      },
      {
        Header: 'Transaction Type',
        accessor: 'transaction_type',
        disableSortBy: true,
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
        disableSortBy: true,
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
        disableSortBy: true,
      },
    ],
    []
  )

  return {
    contributorColumns,
    candidateColumns,
    candidateContributionColumns,
    individualContributionsColumns,
  }
}
