import React from 'react';
import styled from 'styled-components';
import camIcon from '../icons/outline-camera_alt-24px.svg'

const Container = styled.div`
  background: #fff;
  margin-bottom: 8px;
  padding: 0 8px;
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
  background: ${({pictURL}) => pictURL ? `url(${pictURL})` : '#fbfbfb'};
  background-size: cover;
  border-radius: 100%;
  border: 2px solid #FF6D00;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 36px;
`

const Img = styled.img`
  position: relative;
  bottom: 19px;
  left: 45px;
  background: #fff;
  border-radius: 100%;
  padding: 1px;

  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`

export const Profile = ({ pictURL, name, email, telp, submitPict, updatePictHandler, onInputFile, onFileSelect}) => {
  return <>
  <Container>
    <div style={{ height: '72px' }}>
      <ProfilePict pictURL={pictURL}>
        {pictURL ? null : name[0].toUpperCase()}
      </ProfilePict>
      <form onSubmit={submitPict}>
        <Img onClick={updatePictHandler} src={camIcon} />
        <input type='file' ref={input => onInputFile(input)} onChange={(e) => onFileSelect(e)} style={{ display: 'none' }} />
      </form>
    </div>
    <div style={{ maxWidth: '173px', paddingLeft: '8px', boxSizing: 'border-box' }}>
      <h3 style={{ margin: 0, paddingBottom: '4px' }}>{name}</h3>
      <span style={{ fontSize: '14px' }}>{email}</span> <br />
      <span style={{ fontSize: '14px' }}>{telp}</span>
    </div>
  </Container>
  </>
}