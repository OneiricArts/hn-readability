import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import smoothscroll from 'smoothscroll-polyfill';
import './App.scss';
import './skeleton.css';
import ItemPage from './components/item/ItemPage';
import Home from './components/Home';

smoothscroll.polyfill();

const App = () => {
  return (
    <div className="app-container mx-auto">
      <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route
            path="/item"
            render={({ location }) => {
              const searchParams = new URLSearchParams(location.search);
              const id = searchParams.get('id');
              if (id) return <ItemPage id={parseInt(id, 10)} />;
              return <div>No item id specified</div>;
            }}
          ></Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
