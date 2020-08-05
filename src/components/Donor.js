import React, { useEffect, useMemo, useState } from 'react'
import Table from './Table'
import { useParams } from 'react-router-dom'
import { GridContainer } from '@trussworks/react-uswds'

export default function Donor() {
  const [dta, setDta] = useState([])
  let { donor } = useParams()

  useEffect(() => {
    const url = `/api/search/contributors/`
    const search = url + encodeURIComponent(donor)
    if (dta.length === 0) {
      fetch(search)
        .then((res) => res.json())
        .then((json) => setDta(json.data))
    }
    console.log(dta)
  }, [donor, dta])

  const columns = useMemo(
    () => [
      {
        Header: 'Donor Name',
        accessor: 'name',
      },
      // {
      //   Header: 'Donor Type',
      //   accessor: 'donor_type',
      // },
      // {
      //   Header: 'Amount',
      //   accessor: 'amount',
      // },
      // {
      //   Header: 'Donation Type',
      //   accessor: 'donation_type',
      // },
      // {
      //   Header: 'Donation Date',
      //   accessor: 'donation_date',
      // },
      {
        Header: 'Profession',
        accessor: 'profession',
      },
    ],
    []
  )

  return (
    <GridContainer>
      <Table columns={columns} data={dta}></Table>
    </GridContainer>
  )
}
