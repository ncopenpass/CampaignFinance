import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import {
  SEARCH_ROUTE,
  CANDIDATE_ROUTE,
  TABLE_ROUTE,
  DATA_DICTIONARY_ROUTE,
  DEFAULT_ROUTE,
  PRIVACY_POLICY_ROUTE,
  QUICK_SEARCH_ROUTE,
} from '../constants'

import Header from './Header'
import Footer from './Footer'
import Home from './Home'
import SearchResults from './SearchResults'
import QuickSearchResults from './QuickSearchResults'
import Table from './Table'
import DataDictionary from './DataDictionary'
import PrivacyPolicy from './PrivacyPolicy'
import Candidate from './Candidate'

export default function App() {
  return (
    <Router>
      <div>
        <Header></Header>

        <Switch>
          <Route path={SEARCH_ROUTE}>
            <SearchResults />
          </Route>
          <Route path={QUICK_SEARCH_ROUTE}>
            <QuickSearchResults />
          </Route>
          <Route path={CANDIDATE_ROUTE}>
            <Candidate />
          </Route>
          <Route path={PRIVACY_POLICY_ROUTE}>
            <PrivacyPolicy />
          </Route>
          <Route path={TABLE_ROUTE}>
            <Table />
          </Route>
          <Route path={DATA_DICTIONARY_ROUTE}>
            <DataDictionary />
          </Route>
          <Route path={DEFAULT_ROUTE}>
            <Home />
          </Route>
        </Switch>

        <Footer></Footer>
      </div>
    </Router>
  )
}
