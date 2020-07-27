import React from 'react'
import { Search, Button } from '@trussworks/react-uswds'

class SearchBar extends React.Component {
    render() {
        return (
            <div className="search-component">
                <div className="search-bar">
                    <Search onSubmit = {function noRefCheck() {}} size="big" />
                </div>
                <div className="quick-search-btns">
                    <p className="quick-search">Quick Search</p>
                    <Button outline type="button">2020 Candidates</Button>
                    <Button outline type="button">2020 Donors</Button>
                    <Button outline type="button">2020 Contests</Button>
                </div>
            </div>
        
        );
    }

}

export default SearchBar;