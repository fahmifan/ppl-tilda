import React from 'react';
import styled from 'styled-components';

import { axios } from '../utils'
import { AppContext } from '../store';
import {
  Profile,
} from '../components'

const DateCircle = styled.div`
  box-sizing: border-box;
  width: 32px;
  height: 32px;
  font-size: 14px;
  background: ${({ checked }) => checked ? '#FF9800' : '#fff'};
  color: ${({ checked }) => checked ? '#fff' : '#222'};
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 4px 8px;
`;

const Board = styled.div`
  min-height: 255px;
  background: #fff;
  margin: auto;
  margin-bottom: 0px;
  padding: 8px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
`;

const Bar = styled.div`
  width: ${({width}) => width*100}%;
  height: 4px;
  background: #FF9800;
`;

const Percentage = styled.div`
  background: #fff;
  height: 42px;
  padding: 8px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const BottomProgress = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
`;

const ProgressBoard = ({ doneDates = [] }) => {
  const days = 30;
  
  let boardDates = [];
  for (let i = 0; i < days; i++) {
    boardDates.push(<DateCircle>{i+1}</DateCircle>);
  }

  for (let j = 0; j < doneDates.length; j++) {
    boardDates[doneDates[j]-1] = <DateCircle checked>{doneDates[j]}</DateCircle>
  }

  const percent = Math.floor(doneDates.length/30*100);

  return <div style={{   boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.125)'}}>
    <Board>
      {boardDates}
    </Board>
    <Bar width={(percent/100)} />
    <BottomProgress>
      <Percentage>      
        <span style={{ fontSize: '15px', marginBottom: '2px' }}>{percent}%</span>
        <span style={{ fontSize: '8px', color: '#777' }}>Progress</span>
      </Percentage>
      <Percentage>
        <span style={{ fontSize: '15px', marginBottom: '2px' }}>{days-doneDates.length}</span>
        <span style={{ fontSize: '8px', color: '#777' }}>Days left</span>
      </Percentage>
    </BottomProgress>
  </div> 
}

const Container = styled.main`
  max-width: 400px;
  margin: auto;
  padding: 16px;
  margin-top: 8px;
  margin-bottom: 48px;
`

export const Progress = class ProgressComp extends React.Component {
  static contextType = AppContext;
  inputFile = React.createRef();

  state = {
    pictFile: null,
    photoURL: '',
  }

  componentDidMount() {
    this.context.getUser();
  }

  updatePictHandler = (e) => {
    this.inputFile.click();
  }

  onFileSelect = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('photo', file);

    try {
      const { data } = await axios(`/users/${this.context.user._id}/photo`, {
        method: 'POST',
        headers: this.context.authHeaders,
        data: formData,
      });
      this.setState({
        photoURL: data.photoPath
      });
    } catch (e) {
      console.error(e);
      alert('Failed update photo');
    }
  }

  submitPict = (e) => {
    e.preventDefault();
    const pict = this.inputFile;
    console.log(pict);
  }

  onInputFile = (ref) => {
    this.inputFile = ref;
  }

  render() {
    const { photoURL } = this.state;
    const { user } = this.context;
    // list of user practice days
    const days = [];
    // user length of talk in theses days
    let talkLength = 0;
    for (let i = 0; i < user.progress.length; i++) {
      days.push(i+1);
      talkLength += user.progress[i].duration;
    } 

    const minute = Math.floor(talkLength/60);
    const second = talkLength%60;

    return <Container>
      <Profile
        pictURL={photoURL ? photoURL : user.pictURL}
        name={user.name}
        submitPict={this.submitPict}
        telp={user.telp}
        onFileSelect={this.onFileSelect}
        email={user.email}
        onInputFile={this.onInputFile}
        updatePictHandler={this.updatePictHandler} />

      <ProgressBoard doneDates={days} />
      <div style={{
        padding: '8px 16px',
        margin: '8px 0px',
        background: '#fff',
        boxSizing: 'border-box',
        boxShadow: 'rgba(0, 0, 0, 0.125) 0px 2px 2px',
      }}>
        <p style={{ margin: '0px', color: '#777' }}>Talk</p>
        <h3 style={{ margin: '0px', color: '#222' }}>00:{minute < 10 ? `0${minute}` : minute}:{second < 10 ? `0${second}` : second}</h3>
      </div>
    </Container>
  }
}