import React from 'react'
import Header from './header'
import Footer from './footer'
import Candidate from './candidate'
import Search from './search'
import Table from './Table'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

export default function App() {
  return (
    <Router>
      <div>
        <Header></Header>

        <Switch>
          <Route path="/Candidate">
            <Candidate />
          </Route>
          <Route path="/Table">
            <Table />
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
