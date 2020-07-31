import React, { useMemo } from 'react'
import Table from './Table';
import { GridContainer } from '@trussworks/react-uswds';

export default function Candidate() {

  
  const columns = useMemo(
    () => [
      {
        Header: 'Donor Name',
        accessor: 'donor_name'
      },
      {
        Header: 'Donor Type',
        accessor: 'donor_type'
      },
      {
        Header: 'Amount',
        accessor: 'amount'
      },
      {
        Header: 'Donation Type',
        accessor: 'donation_type'
      },
      {
        Header: 'Donation Date',
        accessor: 'donation_date'
      },
      {
        Header: 'Description',
        accessor: 'description'
      }
    ],
    []
  );

  const data = useMemo(
    () => [
      {
        donor_name: 'NC Democratic Leadership Committee',
        donor_type: 'Party Committee',
        amount: 6344.65,
        donation_type: 'Contribution',
        donation_date: '3/5/2020',
        description: ''
      }
    ],
    []
  );
  return (
    <GridContainer>
      <Table columns={ columns } data={ data }>
      </Table>
    </GridContainer>
  )
}
