import React from 'react';
import { withRouter, Link, Redirect } from 'react-router-dom';
import styled from 'styled-components';

import { AppContext } from '../store';
import { InputGroup } from '../components'

const Button = styled.button`
  border: 0px;
  border-radius: 4px;
  padding: 8px;
  min-width: 64px;
  color: #fff;
  background: #FF9800;
`

const Container = styled.div`
  max-width: 256px;
  margin: auto;
`

const initState = {
  password: '',
  email: '',
}

class LoginComp extends React.Component {
  static contextType = AppContext;

  state = { ...initState }
  
  handleInput = (e) => {
    const name = e.target.name
    this.setState({
      [name]: e.target.value,
    });
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = this.state;
    this.context.login({ email, password }, () => {
      this.props.history.replace("/");
    });
  }

  render() {
    const { name, email } = this.state;

    return this.context.user.auth
    ? <Redirect to='/' /> 
    : <Container>
    <br />
    <h2 style={{ color: '#222', margin: '0px 8px' }}>Login</h2>
    <form style={{ padding: '8px' }}>
      <InputGroup title='Email' type='email' name='email' handler={(e) => this.handleInput(e)} value={email} />
      <InputGroup title='Password' type='password' name='password' handler={(e) => this.handleInput(e)} value={name} />
      <Button onClick={this.handleSubmit}>Login</Button> <Link to='/register' style={{ textDecoration: 'none', fontSize: '14px', marginLeft: '8px', color: '#FF9800' }}>Register?</Link>
    </form>
    </Container> 
  }
};

export const Login = withRouter(LoginComp);
