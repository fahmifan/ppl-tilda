import React, { Component } from 'react';
import styled from 'styled-components';
import { Link, BrowserRouter as Router, Route } from 'react-router-dom';

// containers
import {
  Home,
  Profile,
  Speech,
} from './containers'

const AppBar = styled.div`
  height: 64px;
  width: 100%;
  font-size: 24px;
  background: #222;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const BottomNav = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 48px;
  background: #222;
  display: flex;
  justify-content: center;
  align-items: center;
`

const BtnBotNav = styled.button`
  margin-left: 16px;
  margin-right: 16px;
  border: 0px;
  border-radius: 4px;
  padding: 8px;
  background: #fff;

  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`

class App extends Component {
  render() {
    return (
      <Router>
        <AppBar>TILDA</AppBar>
        <Route path='/profile' component={Profile} />
        <Route path='/speech' component={Speech} />
        <Route path='/' exact component={Home} />
        <BottomNav>
          <Link to='/'><BtnBotNav>Home</BtnBotNav></Link>
          <Link to='/profile'><BtnBotNav>Profile</BtnBotNav></Link>
          <Link to='/progress'><BtnBotNav>Progress</BtnBotNav></Link>
        </BottomNav>
      </Router>
    );
  }
}

export default App;
