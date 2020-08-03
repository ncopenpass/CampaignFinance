import React from 'react'
import { Search, Button } from '@trussworks/react-uswds'

class SearchBar extends React.Component {
  handleClick = () => {
    fetch(`/api/search/contributors/john%20smith?`)
      .then((res) => res.json())
      .then((json) => this.setState({ data: json }))
  }

  render() {
    return (
      <div className="search-component">
        <div className="search-bar">
          <Search onClick={this.handleClick()} size="big" />
        </div>
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
      </div>
    )
  }
}

export default SearchBar
