import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import './App.css';
import './skeleton.css';
import FrontPage from './FrontPage';
import Item from './Item';

const App = () => {
  return (
    <Router basename="/hn-readability">
      <Switch>
        <Route exact path="/">
          <FrontPage />
        </Route>
        <Route path="/item" render={({ location }) => {
          const searchParams = new URLSearchParams(location.search);
          return <Item id={(searchParams.get('id') || '')} />;
        }}>
          {/* 22303710 */}
          {/* <Item id={22307322} /> */}
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
