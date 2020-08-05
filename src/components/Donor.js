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
      {
        Header: 'City/State',
        accessor: (cityState) => cityState.city + '/' + cityState.state,
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

  return (
    <GridContainer>
      <Table columns={columns} data={dta}></Table>
    </GridContainer>
  )
}
