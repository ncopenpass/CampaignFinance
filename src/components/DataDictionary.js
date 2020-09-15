import React from 'react'
import { Table, GridContainer, Link } from '@trussworks/react-uswds'

import dictionary from '../static/dataDictionary.json'

const manualLink =
  'https://s3.amazonaws.com/dl.ncsbe.gov/Campaign_Finance/Campaign%20Finance%20Manual%20Version%2012.19.pdf'

const DataDictionary = () => {
  return (
    <>
      <GridContainer>
        <h1>Data Dictionary</h1>
        <Table bordered fullWidth>
          <thead>
            <tr>
              <th scope="col">Term</th>
              <th scope="col">Definition</th>
              <th scope="col">Source</th>
            </tr>
          </thead>
          <tbody style={{ verticalAlign: 'top', overflowWrap: 'break-word' }}>
            {dictionary
              .sort((a, b) => {
                const nameA = a.longVariableName.toUpperCase()
                const nameB = b.longVariableName.toUpperCase()
                if (nameA > nameB) {
                  return 1
                } else if (nameA < nameB) {
                  return -1
                } else {
                  return 0
                }
              })
              .map(({ longVariableName: name, definition, source }) => (
                <tr key={name}>
                  <th scope="row">{name}</th>
                  <td style={{ maxWidth: '400px' }}>{definition}</td>
                  <td>{source}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      </GridContainer>
      <div className="quick-search-btns">
        <Link
          className="usa-button"
          variant="unstyled"
          href={manualLink}
          target="_blank"
          style={{
            margin: 'auto',
            width: '50%',
            display: 'block',
            marginBottom: '30px',
          }}
        >
          2019 NC SBOE Campaign Finance Manual
        </Link>
      </div>
    </>
  )
}

export default DataDictionary
