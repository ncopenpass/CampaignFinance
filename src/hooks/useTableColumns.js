import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import InputFilter from '../components/InputFilter'

const CANDIDATE_URL = '/candidate/'
const CONTRIBUTOR_URL = '/contributors/'

export const useTableColumns = () => {
  const searchContributorColumns = useMemo(
    () => [
      {
        Header: 'Contributor Name',
        id: 'name',
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
        disableSortBy: false,
        disableFilters: false,
        Filter: InputFilter,
      },
      {
        Header: 'City/State',
        id: 'cityState',
        accessor: ({ city, state }) => city + ', ' + state,
        disableFilters: false,
        Filter: InputFilter,
      },
      {
        Header: 'Type',
        accessor: 'type',
      },
      {
        Header: 'Profession',
        accessor: 'profession',
        disableFilters: false,
        Filter: InputFilter,
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

  const searchCandidateColumns = useMemo(
    () => [
      {
        Header: 'Name',
        id: 'candidate_full_name',
        accessor: ({ candidate_full_name, committee_sboe_id }) => (
          <Link to={`${CANDIDATE_URL}${committee_sboe_id}`}>
            &nbsp;
            {candidate_full_name}
          </Link>
        ),
        disableSortBy: false,
        disableFilters: false,
        Filter: InputFilter,
      },
      {
        Header: 'Party',
        accessor: 'party',
        disableFilters: false,
        Filter: InputFilter,
      },
      {
        Header: 'Contest',
        id: 'contest',
        accessor: ({ office, juris }) =>
          juris ? `${office} ${juris}` : office,
        disableFilters: false,
        Filter: InputFilter,
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

  const candidateContributionColumns = useMemo(
    () => [
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
        disableSortBy: false,
      },
      {
        Header: 'Contributor Name',
        id: 'name',
        accessor: ({ contributor_id, name }) => (
          <Link to={`${CONTRIBUTOR_URL}${contributor_id}`}>&nbsp;{name}</Link>
        ),
        disableSortBy: false,
      },
      {
        Header: 'Profession',
        accessor: 'profession',
      },
      {
        Header: 'Transaction Type',
        accessor: 'transaction_type',
      },
      {
        Header: 'Form of Payment',
        accessor: 'form_of_payment',
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
        disableSortBy: false,
      },
    ],
    []
  )

  return {
    searchContributorColumns,
    searchCandidateColumns,
    candidateContributionColumns,
    individualContributionsColumns,
  }
}
