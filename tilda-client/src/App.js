import React, { Component } from 'react';
import styled from 'styled-components';
import {
  Link,
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  withRouter,
} from 'react-router-dom';

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
  Register,
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
  justify-content: space-between;
  padding: 0px 16px;
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

const Button = styled.button`
  border: 1px solid #fff;
  border-radius: 4px;
  padding: 8px;
  min-width: 64px;
  color: #fff;
  background: #FF9800;

  &:hover {
    background: #EF2929;
    border: 1px solid #EF2929;
    cursor: pointer;
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
    _id: 0,
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
    this.loadUserFromLocal('user')
      .then(() => {
        this.getUser();
      })
      .catch(console.error);
  }

  getUser = async () => {
    try {
      const { data } = await axios(`/users/${this.state.user._id}`, {
        method: 'GET',
        headers: {
          'Authorization': this.state.user.token,
        }
      });
      this.setState({ user: { ...this.state.user, ...data } });
    } catch (e) {
      console.error(e);
    }
  }

  handleBotBtn = (num) => {
    this.setState({ btnClicked: num })
  }

  saveToLocal = (key, data) => {
    localStorage.setItem(key, data);
  }

  loadUserFromLocal = (key) => new Promise((resolve, reject) => {
    const userStr = localStorage.getItem(key);
    try {
      const user = userStr && userStr.length > 0 ? JSON.parse(userStr) : initState.user
      this.setState({
        user
      }, () => resolve())
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

  login = async ({ email, password }, cb) => {
    try {
      const { data } = await axios('/login', {
        method: 'POST',
        data: { email, password },
      });

      const user = {
        ...data.user,
        auth: true,
        token: data.token,
      }

      this.saveToLocal('user', JSON.stringify(user))

      this.setState({
        user,
      }, () => {
        cb();
      });
    } catch (e) {
      console.error(e);
    }
  }

  register = async ({ email, password, telp, name, }, cb) => {
    try {
      await axios('/users', {
        method: 'POST',
        data: {
          email, password, telp, name
        }
      });

      cb();
    } catch (e) {
      console.error(e);
      window.alert('Register fail')
    }
  } 

  logout = () => {
    localStorage.removeItem('user');
    this.setState({
      user: initState.user,
    })
  }

  render() {
    const { btnClicked, user } = this.state;

    return (
      <Router>
        <Provider value={{
          user,
          getUser: this.getUser,
          login: this.login,
          register: this.register,
          authHeaders: {
            'Authorization': user.token,
          }
        }}>
          <AppBar><span>Tilda</span>
            { user.auth
                ? <Link style={{ textDecoration: 'none', color: '#fff' }} to="/logout"><Button>Logout</Button></Link>
                : <Link style={{ textDecoration: 'none', color: '#fff' }} to="/login"><Button>Login</Button></Link>
            }
          </AppBar>
          <Switch>
            <RouteUser path='/speech' component={Speech} />
            <RouteUser path='/progress' component={Progress} />
            <RouteUser path='/lets-talk' component={LetsTalk} />
            <Route path='/' exact component={Home} />
            <Route path='/login' exact component={Login} />
            <Route path='/register' exact component={Register} /> 
            <Route path='/logout' component={withRouter(({ history }) => {
              this.logout();
              history.replace("/");

              return <></>
            })} />
            <Redirect to='/' />
          </Switch>

          { user.auth && <BottomNav>
            <Link to='/' onClick={() => this.handleBotBtn(0)} >
              <BtnBotNav name='Home' focus={btnClicked === 0} icon={btnClicked === 0 ? icFocusHome : icBlurHome} />
            </Link>
            <Link to='/progress' onClick={() => this.handleBotBtn(2)} >
              <BtnBotNav name='Progress' focus={btnClicked === 2} icon={btnClicked === 2 ? icFocusProgress : icBlurProgress} />
            </Link>
          </BottomNav>}
        </Provider>
      </Router>
    );
  }
}

export default App;
