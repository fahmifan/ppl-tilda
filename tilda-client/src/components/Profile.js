import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background: #fff;
  margin-bottom: 8px;
  padding: 8px;
  height: 110px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  box-shadow: rgba(0, 0, 0, 0.125) 0px 2px 2px;
`

const ProfilePict = styled.div`
  width: 72px;
  height: 72px;
  border: 0px solid black;
  background: ${({pictURL}) => pictURL ? `url(${pictURL})` : '#222'};
  background-size: cover;
  background-position-x: -5px;
  border-radius: 100%;
  border: 2px solid #FF6D00;
  box-sizing: border-box;
`

export const Profile = ({ pictURL, name, email, telp, ...props}) => {
  return <>
  <Container>
    <ProfilePict pictURL={pictURL} />
    <div style={{ maxWidth: '173px', paddingLeft: '8px', boxSizing: 'border-box' }}>
      <h3 style={{ margin: 0, paddingBottom: '4px' }}>{name}</h3>
      <span style={{ fontSize: '14px' }}>{email}</span> <br />
      <span style={{ fontSize: '14px' }}>{telp}</span>
    </div>
  </Container>
  </>
}