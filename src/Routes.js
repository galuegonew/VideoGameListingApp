import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import LoginPage from "./components/LoginPage/LoginPage"
import TablePage from "./components/TablePage/TablePage"
import ChatPage from "./components/ChatPage/ChatPage"
import SignUpPage from "./components/SignUpPage/SignUpPage"
import InfoPage from "./components/TablePage/TableRender/TableContent/InfoPage/InfoPage"
import Home from "./components/Home/Home"
import './Routes.css';

function Routes() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={LoginPage} />
        <Route exact path="/tablepage" component={TablePage} />
        <Route exact path="/chatpage" component={ChatPage} />
        <Route exact path="/infopage" component={InfoPage} />
        <Route exact path="/home" component={Home} />
        <Route exact path="/signuppage" component={SignUpPage} />
      </Switch>
    </Router>
  );
}

export default Routes;
