import React, { useState, useContext, createContext } from 'react';
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import './App.css';
import './skeleton.css';
import FrontPage from './FrontPage';
import { ItemPage } from './Item';
import { Modal } from 'reactstrap';

const HNReadability: React.FunctionComponent = props => (
  <div className="hn-readability-container">
    {props.children}
  </div>
);

const App = () => {
  const [commentsId, setCommentsId] = useState<string | null>(null);
  const selectComment = (id:string|null) => setCommentsId(id);

  return (
    <HNReadability>
      <FrontPage selectComment={selectComment} hide={false} />
      <div className={`${commentsId ? 'comments--slide' : 'comments--slider'}`}>
        {commentsId &&
          <Modal isOpen={!!commentsId}>
          <ItemPage id={commentsId} selectComment={selectComment}/>
          </Modal>
        }
      </div>
    </HNReadability>
  );
}

export default App;
