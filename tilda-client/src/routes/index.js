import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { Consumer } from '../store'

export const RouteUser = ({ component: Component, ...rest }) => (
  <Consumer>
    {({ user }) => {      
      return (
        <Route
          {...rest}
          render={props =>
            user.auth === true
            ? <Component {...props} />
            : <Redirect to="/login" />
          }
        />
      )}
    } 
  </Consumer>
);

export const RouteAuth = ({ component: Component, ...rest }) => (
  <Consumer>
    {({ user }) => {      
      return (
        <Route
          {...rest}
          render={props =>
            user.auth !== true
            ? <Component {...props} />
            : <Redirect to="/login" />
          }
        />
      )}
    } 
  </Consumer>
);
