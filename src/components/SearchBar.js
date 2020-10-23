import React, { useCallback, useState } from 'react'
import { Search, Button } from '@trussworks/react-uswds'
import { useHistory } from 'react-router-dom'

import {
  SEARCH_FRAGMENT_ROUTE,
  QUICK_SEARCH_FRAGMENT_ROUTE,
  CANDIDATES,
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

  return (
    <div className="search-component">
      <div className="search-bar">
        <Search
          placeholder="Search by Candidate or Contributor"
          onSubmit={handleSearch}
          onChange={handleChange}
          size="big"
        />
      </div>
      {!hideQuickLinks && (
        <div className="quick-search-btns">
          <p className="quick-search">Quick Search</p>
          <Button
            outline
            type="button"
            className="search-btn"
            onClick={handleQuickCandidateLink}
          >
            {`${ELECTION_YEAR} Candidates`}
          </Button>
          {/* Hiding until we're ready to deploy individual contributor pages */}
          {/* <Button
            outline
            type="button"
            className="search-btn"
            onClick={handleQuickDonorLink}
          >
            {`${ELECTION_YEAR} Contributors`}
          </Button> */}
        </div>
      )}
    </div>
  )
}

export default SearchBar
