import React from 'react'
import { Table, GridContainer } from '@trussworks/react-uswds'

import { dictionary } from '../static/dataDictionary.json'

const DataDictionary = () => {
  return (
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
        <tbody>
          {dictionary
            .sort((a, b) => {
              const nameA = a.name.toUpperCase()
              const nameB = b.name.toUpperCase()
              if (nameA > nameB) {
                return 1
              } else if (nameA < nameB) {
                return -1
              } else {
                return 0
              }
            })
            .map(({ name, definition, source }) => (
              <tr key={name}>
                <th scope="row">{name}</th>
                <td style={{ width: '300px' }}>{definition}</td>
                <td>{source}</td>
              </tr>
            ))}
        </tbody>
      </Table>
    </GridContainer>
  )
}

export default DataDictionary
