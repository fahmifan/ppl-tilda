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
  telp: 0,
  name: '',
}

class RegisterComp extends React.Component {
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
    const { email, password, name, telp } = this.state;
    this.context.register({ email, password, name, telp }, () => {
      this.props.history.replace("/login");
    });
  }

  render() {
    const { name, email, telp, password } = this.state;

    return this.context.user.auth
    ? <Redirect to='/' /> 
    : <Container>
    <br />
    <h2 style={{ color: '#222', margin: '0px 8px' }}>Register</h2>
    <form style={{ padding: '8px' }}>
      <InputGroup title='Name' type='name' name='name' handler={(e) => this.handleInput(e)} value={name} />
      <InputGroup title='Email' type='email' name='email' handler={(e) => this.handleInput(e)} value={email} />
      <InputGroup title='Password' type='password' name='password' handler={(e) => this.handleInput(e)} value={password} />
      <InputGroup title='Phone' type='tel' name='telp' handler={(e) => this.handleInput(e)} value={telp} />
      <Button onClick={this.handleSubmit}>Register</Button> 
      <Link to='/login' style={{ textDecoration: 'none', fontSize: '14px', marginLeft: '8px', color: '#FF9800' }}>
        Login?
      </Link>
    </form>
    </Container> 
  }
};

export const Register = withRouter(RegisterComp);

export default Register;
