import React from 'react'
import { Search, Button } from '@trussworks/react-uswds'
import { withRouter } from 'react-router-dom'

class SearchBar extends React.Component {
  handleChange = (e) => {
    this.setState({ donor: e.target.value })
  }

  handleClick = (e) => {
    e.preventDefault()
    this.props.history.push(`/search/${this.state.donor}`)
  }

  render() {
    return (
      <div className="search-component">
        <div className="search-bar">
          <Search
            onSubmit={this.handleClick}
            onChange={this.handleChange}
            size="big"
          />
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

export default withRouter(SearchBar)
