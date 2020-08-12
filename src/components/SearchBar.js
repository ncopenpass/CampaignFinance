import React, { useCallback, useState } from 'react'
import { Search, Button } from '@trussworks/react-uswds'
import { useHistory } from 'react-router-dom'

const SearchBar = ({ hideQuickLinks }) => {
  const history = useHistory()
  const [donor, setDonor] = useState('')

  const handleChange = useCallback((e) => setDonor(e.target.value), [])

  const handleClick = useCallback(
    (e) => {
      e.preventDefault()
      history.push(`/search/${donor}`)
    },
    [donor, history]
  )

  return (
    <div className="search-component">
      <div className="search-bar">
        <Search onSubmit={handleClick} onChange={handleChange} size="big" />
      </div>
      {!hideQuickLinks && (
        <div className="quick-search-btns">
          <p className="quick-search">Quick Search</p>
          <Button outline type="button" className="search-btn">
            2020 Candidates
          </Button>
          <Button outline type="button" className="search-btn">
            2020 Donors
          </Button>
          <Button outline type="button" className="search-btn">
            2020 Contests
          </Button>
        </div>
      )}
    </div>
  )
}

export default SearchBar
