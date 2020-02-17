import React from 'react';
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import './App.css';
import './skeleton.css';
import FrontPage from './FrontPage';
import { ItemPage } from './Item';

const App = () => {
  return (
    <Router basename="/hn-readability">
      <Switch>
        <Route exact path="/">
          <FrontPage />
        </Route>
        <Route path="/item" render={({ location }) => {
          const searchParams = new URLSearchParams(location.search);
          const id = searchParams.get('id') || ''
          return <ItemPage id={id} />;
        }}>
          {/* 22303710 */}
          {/* <Item id={22307322} /> */}
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
