import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom'
import {
  Grid,
  GridContainer
} from '@trussworks/react-uswds';
import Table from './Table';
import '../css/candidate.scss';

const Candidate = () => {
  const [candData, setCandData] = useState({})
  const [contData, setContData] = useState([])
  let { candidate } = useParams()

  useEffect(() => {
    const fetchContributions = () => {
      const url = `/api/candidates/` + candData.sboe_id + `/contributions`;
      fetch(url)
        .then((res) => res.json())
        .then((json) => setContData(json.data))
    }

    const fetchData = () => {
      const url = `/api/search/candidates/` + encodeURIComponent(candidate)
      fetch(url)
        .then((res) => res.json())
        .then((json) => setCandData(json.data[0]))
        .then(() => fetchContributions())
    }
    
    fetchData();
  }, [candidate, candData.sboe_id])

  const columns = useMemo(
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
        accessor: 'date_occured',
      },
      {
        Header: 'Description',
        accessor: 'purpose'
      }
    ],
    []
  )
  
  return (
    <div className='container'>
      <GridContainer>
        <Grid row>
          <Grid col>
            {/* Placeholder value for href */}
            <a href='/'>Back to search results</a>
          </Grid>
        </Grid>
        <Grid row>
          <Grid col>
            <p class='candidate-label'>CANDIDATE</p>
          </Grid>
        </Grid>
        <Grid row>
          <Grid col>
            <h1 class='candidate-name'>{ candData.candidate_first_last_name }</h1>
            <p class='candidate-party'>{ candData.party }</p>
            <p class='candidate-prop'><span class='candidate-prop-label'>Current Office:</span> { candData.office }</p>
            {/* 
              Placeholder value for Last Contest and Associated Candidate PAC until we have that data 
              Placeholder value for href
            */}
            <p class='candidate-prop'><span class='candidate-prop-label'>Last Contest:</span> <a href='/'>Gubernatorial Election 2020</a></p>
            <p class='candidate-prop'><span class='candidate-prop-label'>Associated Candidate PAC:</span> Cooper for North Carolina</p>
          </Grid>
          <Grid col>
            {/* Placeholder value for Total Funding until we have that data */}
            <p class='total-funding'>$234,138.53</p>
            <p class='total-funding-tooltip'>Total Funding</p>
          </Grid>
        </Grid>
        <Grid row>
          <Grid col>
            <Table columns={columns} data={contData}></Table>
          </Grid>
        </Grid>
      </GridContainer>
    </div>
  )
}

export default Candidate;