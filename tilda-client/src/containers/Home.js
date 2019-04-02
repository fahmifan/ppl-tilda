import React from 'react';
import { Link }  from 'react-router-dom';
import styled from 'styled-components';
import btn5minute from '../icons/btn-5-minute.png';
import btnLetsTalk from '../icons/btn-lets-talk.png';

const Container = styled.div`
  margin: auto;
  max-width: 800px;
  display: block;
  padding: 8px;
  min-height: 100vh;
`
const BtnImage = styled.div`
  box-sizing: border-box;
  background: ${({imgURL}) => imgURL ? `url(${imgURL})` : '#CCC'};
  background-size: contain;
  width: 100%;
  min-height: 110px;

  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;

export const Home = () => (
  <Container>
  <Link to='/speech'><BtnImage imgURL={btn5minute} /></Link> <br />
  <BtnImage imgURL={btnLetsTalk} />
  </Container>
);
