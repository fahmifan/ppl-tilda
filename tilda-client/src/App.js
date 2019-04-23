import React, { Component } from 'react';
import styled from 'styled-components';
import { Link, BrowserRouter as Router, Route } from 'react-router-dom';

import icFocusHome from './icons/focus-icons/home.svg'; 
import icFocusProfile from './icons/focus-icons/profile.svg'; 
import icFocusProgress from './icons/focus-icons/progress.svg'; 

import icBlurHome from './icons/blur-icons/home.svg'; 
import icBlurProfile from './icons/blur-icons/profile.svg'; 
import icBlurProgress from './icons/blur-icons/progress.svg'; 

import { axios } from './utils';
import { Provider } from './store';

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
  box-shadow: rgba(0, 0, 0, 0.125) 0px 2px 2px;
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
  box-shadow: 0px -1px 4px rgba(0, 0, 0, 0.125);

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
    opacity: 0.8;
  }
`

const BtnBotNav = ({ icon, name, focus = false }) => {
  return <BtnContainer style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '0 8px 0 8px',
    }}>
    <BtnBotNavIcon src={icon} alt={name} />
    <IconText focus={focus}>{name}</IconText>
  </BtnContainer>
}

const initState = {
  user: {
    auth: false,
    name: '',
    email: '',
    telp: '',
    pictURL: '',
    progress: [],
  },
}

class App extends Component {
  state = {
    btnClicked: 0,
    user: initState.user
  }

  componentDidMount() {
    this.getUser();
  }

  getUser = async () => {
    try {
      const { data } = await axios('/users/1', {
        method: 'GET',
      });
      this.setState({ user: { ...this.state.user, ...data } });
    } catch (e) {
      console.error(e);
    }
  }

  handleBotBtn = (num) => {
    this.setState({ btnClicked: num })
  }

  render() {
    const { btnClicked } = this.state;

    return (
      <Router>
        <Provider value={{
          user: this.state.user,
          getUser: this.getUser,
        }}>
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
        </Provider>
      </Router>
    );
  }
}

export default App;
