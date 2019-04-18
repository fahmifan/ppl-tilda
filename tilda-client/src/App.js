import React, { Component } from 'react';
import styled from 'styled-components';
import { Link, BrowserRouter as Router, Route } from 'react-router-dom';

import icFocusHome from './icons/focus-icons/home.svg'; 
import icFocusProfile from './icons/focus-icons/profile.svg'; 
import icFocusProgress from './icons/focus-icons/progress.svg'; 

import icBlurHome from './icons/blur-icons/home.svg'; 
import icBlurProfile from './icons/blur-icons/profile.svg'; 
import icBlurProgress from './icons/blur-icons/progress.svg'; 


// containers
import {
  Home,
  Profile,
  Speech,
  Progress,
} from './containers'

const theme = {
  color: {
    primary: '#FF9800',
    background: '#F5F5F5',
    text: '#FFF',
    light: '#FFF',
  },
};

const AppBar = styled.div`
  height: 54px;
  width: 100%;
  box-sizing: border-box;
  font-size: 18px;
  background: ${theme.color.primary};
  color: ${theme.color.text};
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
  background: ${theme.color.light};
  display: flex;
  justify-content: center;
  align-items: center;

  a {
    text-decoration: unset;
  }
`

const BtnBotNavIcon = styled.img`
  margin-left: 16px;
  margin-right: 16px;
`

const IconText = styled.span`
  font-size: 12px;
  margin-top: 1px;
  ${({ focus }) => focus ? 'color: #FF9800' : ''}
`

const BtnContainer = styled.div`
  color: #222;

  &:hover, &:focus {
    cursor: pointer;
    color: #FF9800;
  }
`

const BtnBotNav = ({ icon, name, focus = false }) => {
  return <BtnContainer style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
    <BtnBotNavIcon src={icon} alt={name} />
    <IconText focus={focus}>{name}</IconText>
  </BtnContainer>
}

class App extends Component {
  state = {
    btnClicked: 0,
  }

  handleBotBtn = (num) => {
    this.setState({ btnClicked: num })
  }

  render() {
    const { btnClicked } = this.state;

    return (
      <Router>
        <AppBar>Tilda</AppBar>
        <Route path='/profile' component={Profile} />
        <Route path='/speech' component={Speech} />
        <Route path='/progress' component={Progress} />
        <Route path='/' exact component={Home} />
        <BottomNav>
          <Link to='/' onClick={() => this.handleBotBtn(0)} >
            <BtnBotNav name='Home' focus={btnClicked === 0} icon={btnClicked === 0 ? icFocusHome : icBlurHome} />
          </Link>
          <Link to='/profile' onClick={() => this.handleBotBtn(1)} >
            <BtnBotNav name='Profile' focus={btnClicked === 1} icon={btnClicked === 1 ? icFocusProfile : icBlurProfile} />
          </Link>
          <Link to='/progress' onClick={() => this.handleBotBtn(2)} >
            <BtnBotNav name='Progress' focus={btnClicked === 2} icon={btnClicked === 2 ? icFocusProgress : icBlurProgress} />
          </Link>
        </BottomNav>
      </Router>
    );
  }
}

export default App;
