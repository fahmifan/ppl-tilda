import React from 'react';
import styled from 'styled-components';

import { AppContext } from '../store';

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
  margin: 8px;
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
  padding: 16px;
  /* margin-top: 16px; */
`

export const Progress = class ProgressComp extends React.Component {
  static contextType = AppContext;

  componentDidMount() {
    this.context.getUser();
  }

  render() {
    const { user } = this.context;
    const days = [];
    for (let i = 0; i < user.progress.length; i++) {
      days.push(i+1);
    } 

    return <Container>
      <ProgressBoard doneDates={days} />
    </Container>
  }
}