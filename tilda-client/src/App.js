import React, { Component } from 'react';
import styled from 'styled-components';
import { Link, BrowserRouter as Router, Route } from 'react-router-dom';

import icFocusHome from './icons/focus-icons/home.svg'; 
import icFocusProgress from './icons/focus-icons/progress.svg'; 

import icBlurHome from './icons/blur-icons/home.svg'; 
import icBlurProgress from './icons/blur-icons/progress.svg'; 

import { axios } from './utils';
import { Provider } from './store';
import { RouteUser } from './routes';

// containers
import {
  Home,
  Speech,
  Progress,
  LetsTalk,
  Login,
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
    token: '',
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

  login = async ({ email, password }) => {
    try {
      const { data } = await axios('/login', {
        method: 'POST',
        data: { email, password },
      });

      this.setState({
        user: {
          ...data.user,
          auth: true,
          token: data.token,
        }
      })

    } catch (e) {
      console.error(e);
    }
  }

  render() {
    const { btnClicked } = this.state;

    return (
      <Router>
        <Provider value={{
          user: this.state.user,
          getUser: this.getUser,
          login: this.login,
        }}>
          <AppBar>Tilda</AppBar>
          <RouteUser path='/speech' component={Speech} />
          <RouteUser path='/progress' component={Progress} />
          <RouteUser path='/lets-talk' component={LetsTalk} />
          <Route path='/' exact component={Home} />
          <Route path='/login' exact component={Login} />

          <BottomNav>
            <Link to='/' onClick={() => this.handleBotBtn(0)} >
              <BtnBotNav name='Home' focus={btnClicked === 0} icon={btnClicked === 0 ? icFocusHome : icBlurHome} />
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
