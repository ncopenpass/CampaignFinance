import React, { useCallback, useState } from 'react'
import { Search } from '@trussworks/react-uswds'
import { useHistory, useLocation } from 'react-router-dom'

import { SEARCH_FRAGMENT_ROUTE } from '../constants'

const SearchBar = () => {
  const history = useHistory()
  const location = useLocation()
  const [searchTerm, setSearchTerm] = useState(
    location.pathname.replace('/search/', '') || ''
  )

  const handleChange = useCallback((e) => setSearchTerm(e.target.value), [])

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault()
      history.push(`${SEARCH_FRAGMENT_ROUTE}${searchTerm}`)
    },
    [searchTerm, history]
  )

  return (
    <div className="search-component">
      <div className="search-bar">
        <Search
          placeholder="Search by Candidate, Contributor, or PAC"
          onSubmit={handleSearch}
          onChange={handleChange}
          size="big"
          defaultValue={searchTerm}
        />
      </div>
    </div>
  )
}

export default SearchBar
