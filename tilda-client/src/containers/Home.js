import React from 'react';
import { Link }  from 'react-router-dom';
import styled from 'styled-components';
import btn5minute from '../icons/btn-5-minute.png';
import btnLetsTalk from '../icons/btn-lets-talk.png';

import img5Minute from '../icons/pedestrian_crossing.svg'
import imgLetsTalk from '../icons/missed_chances.svg'

const Container = styled.div`
  margin: auto;
  max-width: 800px;
  display: block;
  padding: 8px 16px 0 16px;
  min-height: 95vh;

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
    cursor: pointer;
    opacity: 0.8;
  }
`;

const CardContainer = styled.div`
  box-sizing: border-box;
  border-radius: 4px;
  background: #fff;
  border-bottom: 0.5px solid #ccc;
  padding: 8px 0 8px 0;
  margin: 8px 0 8px 0;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.125);
`

const Card = ({ imgURL, title, description }) => (
  <CardContainer>
    <BtnImage imgURL={imgURL} />
    <p style={{ fontWeight: 'bold', margin: '8px 16px' }}>{title}</p>
    <p style={{ fontSize: '14px', margin: '8px 16px' }}>{description} </p>
  </CardContainer>
);

export const Home = () => (
  <Container>
    <Link to='/speech'>
      <Card imgURL={img5Minute} title='5 Minute Challenge' description='Latihan ngobrol Inggris barenga Tilda selama 5 menit. Bisa dilakuini pas perjalanan PP dari kosan ke kampus.' />
    </Link>
    <Card imgURL={imgLetsTalk} title="Let's Talk" description='Start voice call to other people and talk to them in english' />
  </Container>
);
