import React from 'react';
import styled from 'styled-components';

import { axios } from '../utils';

// import pictHolder from '../icons/profil--pict-malik.png'

const ProfilePict = styled.div`
  width: 128px;
  height: 128px;
  border: 0px solid black;
  background: ${({imgURL}) => imgURL ? `url(${imgURL})` : '#222'};
  background-size: cover;
  background-position-x: -5px;
  border-radius: 100%;
  margin: auto;
  /* box-shadow: 4px 4px 8px 2px rgba(85,85,85,1); */
`

const Desc = styled.div`
  min-width: 250px;
  height: 200px;
  background: #fff;
  /* background: #FFC691; */
  margin: auto;
  margin-left: 8px;
  margin-right: 8px;
  padding-left: 16px;
  padding-right: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* font-weight: bold; */
  border-radius: 8px;
  /* box-shadow: 4px 4px 8px 2px rgba(85,85,85,1); */
`

const Container = styled.div`
  background: #FFC691;
  /* background: #fff; */
  min-height: 100vh;
  max-width: 800px;
  margin: auto;
`;

export const Profile = class ProfileComp extends React.Component {  
  state = {
    userInfo: {
      name: '',
      email: '',
      telp: '',
      pictURL: '',
    },   
  }

  componentDidMount() {
    this.getUser();
  }

  getUser = async () => {
    try {
      const { data } = await axios.get('/users/1');
      this.setState({
        userInfo: data,
      })
    } catch(e) {
      console.log(e);
    }
  }

  render() {
    const { userInfo } = this.state;

    return <Container>
      <br />
      <ProfilePict imgURL={userInfo.pictURL}></ProfilePict> 
      <br />
      <Desc>
        <p>Nama: {userInfo.name}</p>
        <p>Email: {userInfo.email}</p>
        <p>Telp: {userInfo.telp}</p>
      </Desc>
    </Container>
  }
} 