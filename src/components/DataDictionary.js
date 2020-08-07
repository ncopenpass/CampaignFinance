import React from 'react'
import { Table } from '@trussworks/react-uswds'

import { dictionary } from '../static/dataDictionary.json'

const dataDictionaryPage = {
  padding: '50px 100px',
}

const DataDictionary = () => {
  return (
    <div style={dataDictionaryPage}>
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
            .filter(({ published }) => published)
            .sort((a, b) => {
              const nameA = a.name.toUpperCase()
              const nameB = b.name.toUpperCase()
              return nameA - nameB
            })
            .map(({ name, definition, source }) => (
              <tr key={name}>
                <th scope="row">{name}</th>
                <td>{definition}</td>
                <td>{source}</td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  )
}

export default DataDictionary
