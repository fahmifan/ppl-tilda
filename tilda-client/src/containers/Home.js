import React from 'react';
import { Link }  from 'react-router-dom';
import styled from 'styled-components';

import img5Minute from '../icons/pedestrian_crossing.svg'
import imgLetsTalk from '../icons/missed_chances.svg'

const Container = styled.div`
  margin: auto;
  max-width: 800px;
  display: block;
  padding: 8px 16px 0 16px;
  margin-bottom: 64px;

  a {
    text-decoration: initial;
    color: inherit;
  }
`
const BtnImage = styled.div`
  box-sizing: border-box;
  background: ${({imgURL}) => imgURL ? `url(${imgURL})` : '#CCC'};
  background-size: contain;
  width: 100%;
  height: 100px;
  background-position: center;
  background-repeat: no-repeat;

  &:hover {
    opacity: 0.8;
  }
`;

const CardContainer = styled.div`
  box-sizing: border-box;
  border-radius: 4px;
  background: #fff;
  border-bottom: 0.5px solid #ccc;
  padding: 8px 0 8px 0;
  margin: 8px 0 16px 0;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.125);

  &:hover {
    cursor: pointer;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  }
`

const BtnStart = styled.button`
  box-sizing: border-box;
  width: 87px;
  height: 36px;
  background: #FF9800;
  border-radius: 2px;
  border: 0px;
  color: #fff;
  bottom: 0;
  right: 0;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.125);

  &:hover {
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
    opacity: 0.8;
    cursor: pointer;
  }
`

const Card = ({ imgURL, title, description, btnText }) => (
  <CardContainer>
    <BtnImage imgURL={imgURL} />
    <p style={{ fontSize: '18px', paddingTop: '8px', fontWeight: 'bold', margin: '8px 16px' }}>{title}</p>
    <p style={{ fontSize: '14px', margin: '8px 16px' }}>{description} </p>
    <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center', 
        margin: '0px 16px 16px 8px',
    }}>
      <Link to='/speech'>
        <BtnStart>{btnText}</BtnStart>
      </Link>
    </div>
  </CardContainer>
);

export const Home = () => (
  <Container>
    <Link to='/speech'>
      <Card imgURL={img5Minute} btnText='START' title='5 Minute Challenge' description='Latihan ngobrol Inggris barenga Tilda selama 5 menit. Bisa dilakuini pas perjalanan PP dari kosan ke kampus.' />
    </Link>
    <Card imgURL={imgLetsTalk} btnText='CALL' title="Let's Talk" description='Start voice call to other people and talk to them in english' />
  </Container>
);
