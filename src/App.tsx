import React from 'react';
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import './App.css';
import './skeleton.css';
import FrontPage from './FrontPage';

const App = () => {
  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/">
            <FrontPage />
          </Route>
          <Route path="/item" render={({ location }) => {
            const searchParams = new URLSearchParams(location.search);
            const id = searchParams.get('id');
            return <div>item #{id} </div>
          }}>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
