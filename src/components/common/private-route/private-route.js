import React from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

const PrivateRoute = ({ component: Component, user, ...rest }) => (
  <Route {...rest} render={(props) => {
    return (
      user
        ? <Component {...props} />
        : <Redirect to={{
            pathname: '/login',
            state: { from: props.location }
          }} />
    )
  }} />
)

export default withRouter(connect(
  (state) => ({
    user: state.user
  })
)(PrivateRoute));