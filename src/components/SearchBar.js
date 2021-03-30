import React, { useCallback, useState } from 'react'
import { Search, Button } from '@trussworks/react-uswds'
import { useHistory } from 'react-router-dom'

import {
  SEARCH_FRAGMENT_ROUTE,
  QUICK_SEARCH_FRAGMENT_ROUTE,
  CANDIDATES,
  CONTRIBUTORS,
  ELECTION_YEAR,
} from '../constants'

const SearchBar = ({ hideQuickLinks }) => {
  const history = useHistory()
  const [searchTerm, setSearchTerm] = useState('')

  const handleChange = useCallback((e) => setSearchTerm(e.target.value), [])

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault()
      history.push(`${SEARCH_FRAGMENT_ROUTE}${searchTerm}`)
    },
    [searchTerm, history]
  )

  const handleQuickCandidateLink = useCallback(
    (e) => {
      e.preventDefault()
      history.push(`${QUICK_SEARCH_FRAGMENT_ROUTE}${CANDIDATES}`)
    },
    [history]
  )

  const handleQuickDonorLink = useCallback(
    (e) => {
      e.preventDefault()
      history.push(`${QUICK_SEARCH_FRAGMENT_ROUTE}${CONTRIBUTORS}`)
    },
    [history]
  )

  return (
    <div className="search-component">
      <div className="search-bar">
        <Search
          placeholder="Search by Candidate, Contributor, or PAC"
          onSubmit={handleSearch}
          onChange={handleChange}
          size="big"
        />
      </div>
    </div>
  )
}

export default SearchBar
