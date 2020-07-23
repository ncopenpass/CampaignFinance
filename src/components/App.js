import React from 'react'
import Candidate from './candidate'
import Search from './search'
import { BrowserRouter as Router, Switch, Route , Link} from 'react-router-dom';

export default function App() {
    return (
        <Router>
        <div>
          <ul>
            <li>
              <Link to="/">Search</Link>
            </li>
            <li>
              <Link to="/candidate">About</Link>
            </li>
          </ul>
  
          <Switch>
            <Route path="/candidate">
              <Candidate />
            </Route>
            <Route path="/">
              <Search />
            </Route>
          </Switch>
        </div>
      </Router>
    );
    
}
