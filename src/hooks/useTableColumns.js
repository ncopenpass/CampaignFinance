import { useMemo } from 'react'

export const useTableColumns = () => {
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

  const candidateContributionColumns = useMemo(
    () => [
      {
        Header: 'Donor Name',
        accessor: 'name',
      },
      {
        Header: 'Donor Type',
        accessor: 'transaction_type',
      },
      {
        Header: 'Amount',
        accessor: 'amount',
      },
      {
        Header: 'Donation Type',
        accessor: 'form_of_payment',
      },
      {
        Header: 'Donation Date',
        accessor: 'date_occurred',
      },
      {
        Header: 'Description',
        accessor: 'purpose',
      },
    ],
    []
  )

  return {
    donorColumns,
    candidateColumns,
    candidateContributionColumns,
  }
}
