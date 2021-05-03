import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import smoothscroll from 'smoothscroll-polyfill';
import './App.scss';
import './skeleton.css';
import ItemPage from './components/item/ItemPage';
import Home from './components/Home';
import { StoryTypes, storyTypes } from './api/getItemsFromApi';
import { Contact } from './components/item/Contact';

smoothscroll.polyfill();

const App = () => {
  return (
    <div className="app-container mx-auto">
      <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>

          <Route exacty path="/contact" render={Contact} />

          <Route
            path={storyTypes.map(s => `/${s}`)}
            render={({ location }) => (
              <Home
                initStoryType={location.pathname.split('/')[1] as StoryTypes}
              />
            )}
          />

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
