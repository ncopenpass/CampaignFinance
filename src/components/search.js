import React from 'react'
import SearchBar from './SearchBar.js'

export default function search() {
    return (
        <div className="grid-container search-page">
            <div className="grid-row">
                <div className="grid-col-12">
                    <h1 className="search-header">Search North Carolina Campaign Finance Data</h1>
                </div>
            </div>
            <div className="grid-row">
                <div className="grid-col-12">
                    <div className="home-search">
                        <SearchBar />
                    </div>
                </div>
            </div>
            
        </div>
    )
}
