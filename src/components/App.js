import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import {
  SEARCH_ROUTE,
  CANDIDATE_ROUTE,
  TABLE_ROUTE,
  DATA_DICTIONARY_ROUTE,
  DEFAULT_ROUTE,
  PRIVACY_POLICY_ROUTE,
  ABOUT_PAGE_ROUTE,
} from '../constants'

import Header from './Header'
import Footer from './Footer'
import Search from './Search'
import SearchResults from './SearchResults'
import Table from './Table'
import DataDictionary from './DataDictionary'
import PrivacyPolicy from './PrivacyPolicy'
import AboutPage from './AboutPage'
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
          <Route path={CANDIDATE_ROUTE}>
            <Candidate />
          </Route>
          <Route path={PRIVACY_POLICY_ROUTE}>
            <PrivacyPolicy />
          </Route>
          <Route path={TABLE_ROUTE}>
            <Table />
          </Route>
          <Route path={ABOUT_PAGE_ROUTE}>
            <AboutPage />
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
