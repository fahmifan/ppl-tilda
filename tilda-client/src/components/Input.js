import React from 'react';

import styled from 'styled-components';

export const Input = styled.input`
  padding: 8px;
  border: 1px solid #eee;
  border-radius: 4px;
  margin: 4px 0px;
  width: 100%;
`

export const InputGroup = ({ type = '', value, name, title, handler }) => <>
  <div style={{ margin: '8px 0px' }}>
    <label style={{ color: '#444' }} htmlFor={name}><small>{title}</small></label> <br />
    <Input type={type} name={name} onChange={(e) => handler(e)} value={value} />
  </div>
</>
