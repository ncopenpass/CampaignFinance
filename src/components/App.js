import React from 'react'
import Donor from './Donor'
import Header from './Header'
import Footer from './Footer'
import Search from './Search'
import Table from './Table'
import DataDictionary from './DataDictionary'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

export default function App() {
  return (
    <Router>
      <div>
        <Header></Header>

        <Switch>
          <Route path="/Donor/:donor">
            <Donor />
          </Route>
          <Route path="/Table">
            <Table />
          </Route>
          <Route path="/DataDictionary">
            <DataDictionary />
          </Route>
          <Route path="/">
            <Search />
          </Route>
        </Switch>

        <Footer></Footer>
      </div>
    </Router>
  )
}
