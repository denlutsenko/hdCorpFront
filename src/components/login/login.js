import React, { Component } from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import './login.css';

import { loginUser } from '../../actions/user';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
    this.from = this.props.location.state || { from: '/'};
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = event => {
    event.preventDefault();
    const { email, password } = this.state;
    this.props.onLogIn({ email, password });
  }

  render() {

    if (this.props.user) {
      return <Redirect to={'/balance'} />
    }

    return (
      <div className='Login'>
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId='email' bsSize='large'>
            <ControlLabel>Email</ControlLabel>
            <FormControl
              autoFocus
              // type='email'
              value={this.state.email}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId='password' bsSize='large'>
            <ControlLabel>Password</ControlLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type='password'
            />
          </FormGroup>
          <Button
            block
            bsSize='large'
            // disabled={!this.validateForm()}
            type="submit"
          >
            Login
          </Button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user
});

const mapDispatchToProps = (dispatch) => {
  return {
    onLogIn: ({ email, password }) => {
      dispatch(loginUser({email, password}));
    }
  };
}; 

export default connect(mapStateToProps ,mapDispatchToProps)(Login);
