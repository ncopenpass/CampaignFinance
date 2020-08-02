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
      },
      {
        donor_name: 'Lawrence Baxter',
        donor_type: 'Individual',
        amount: 2149.53,
        donation_type: 'In-Kind',
        donation_date: '1/22/2020',
        description: 'Catering'
      },
      {
        donor_name: 'Anne Abramson',
        donor_type: 'Individual',
        amount: 5400.00,
        donation_type: 'Contribution',
        donation_date: '2/5/2020',
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
