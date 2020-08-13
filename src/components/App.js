import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import {
  DONOR_ROUTE,
  TABLE_ROUTE,
  DATA_DICTIONARY_ROUTE,
  DEFAULT_ROUTE,
  PRIVACY_POLICY_ROUTE,
} from '../constants'

import Donor from './Donor'
import Header from './Header'
import Footer from './Footer'
import Search from './Search'
import Table from './Table'
import DataDictionary from './DataDictionary'
import PrivacyPolicy from './PrivacyPolicy'

export default function App() {
  return (
    <Router>
      <div>
        <Header></Header>

        <Switch>
          <Route path={PRIVACY_POLICY_ROUTE}>
            <PrivacyPolicy />
          </Route>
          <Route path={DONOR_ROUTE}>
            <Donor />
          </Route>
          <Route path={TABLE_ROUTE}>
            <Table />
          </Route>
          <Route path={DATA_DICTIONARY_ROUTE}>
            <DataDictionary />
          </Route>
          <Route path={DEFAULT_ROUTE}>
            <Search />
          </Route>
        </Switch>

        <Footer></Footer>
      </div>
    </Router>
  )
}
