import React from 'react'

const InputFilter = ({ column: { setFilter, filterValue, Header } }) => (
  <input
    value={filterValue || ''}
    placeholder={`Filter by ${Header.toLowerCase()}`}
    onChange={(e) => {
      setFilter(e.target.value)
    }}
  />
)

export default InputFilter
