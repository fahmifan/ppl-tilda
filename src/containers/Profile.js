import React from 'react';
import styled from 'styled-components';

import pictHolder from '../icons/profil--pict-malik.png'

const ProfilePict = styled.div`
  width: 100px;
  height: 100px;
  border: 1px solid black;
  background: ${({imgURL}) => imgURL ? `url(${imgURL})` : '#ccc'};
  background-size: cover;
  background-position-x: -5px;
  border-radius: 100%;
  margin: auto;
`

const Desc = styled.div`
  width: 300px;
  height: 200px;
  background: #fff;
  margin: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-weight: bold;
`

export const Profile = class ProfileComp extends React.Component {  
  render() {
    return <div style={{ background: '#FFC691', minHeight: '100vh' }}>
      <br />
      <ProfilePict imgURL={pictHolder}></ProfilePict> 
      <Desc>
        <p>Nama: Malik Zulfikar</p>
        <p>Email: malik@gmail.com</p>
        <p>Telp: +62 822 123 123</p>
      </Desc>
    </div>
  }
} 