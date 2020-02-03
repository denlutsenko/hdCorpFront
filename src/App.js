import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Loader from 'react-loader';
import { connect } from 'react-redux';

import './App.css';
import { Header, PrivateRoute, Login, Modal } from './components';
import {
  Administration,
  Balance,
  Production,
  Report,
  Sales,
  Employee,
  PostcardList,
  EmployeeForm,
  Clients,
  ClientForm,
  PostcardForm
} from './pages';

const readirectToBalance = () => (<Redirect to='/balance' />);

const App = ({ isAppLoaded, isModalActive, modalText }) => {

  return (
    <Router>
      <div>
        <Loader loaded={isAppLoaded} />
        <Modal active={isModalActive} text={modalText} />
        <div className='container'>
          <Route path='/' component={readirectToBalance} exact />
          <Route path='/' component={Header} />
          <Route path='/login' component={Login} />
          <PrivateRoute path='/balance' component={Balance} />
          <PrivateRoute path='/production' component={Production} />
          <PrivateRoute path='/sales' component={Sales} />
          <PrivateRoute path='/report' component={Report} />
          <PrivateRoute path='/administration' component={Administration} />
          <PrivateRoute path='/administration/postcards' component={PostcardList} exact />
          <PrivateRoute path='/administration/postcards/new' component={PostcardForm} />
          <PrivateRoute path='/administration/postcards/edit' component={PostcardForm} />
          <PrivateRoute path='/administration/employee' component={Employee} exact />
          <PrivateRoute path='/administration/employee/new' component={EmployeeForm} />
          <PrivateRoute path='/administration/employee/edit' component={EmployeeForm} />
          <PrivateRoute path='/administration/clients' component={Clients} exact />
          <PrivateRoute path='/administration/clients/edit' component={ClientForm} />
          <PrivateRoute path='/administration/clients/new' component={ClientForm} />
        </div>
      </div>
    </Router>
  );
}

const mapStateToProps = (state) => ({
  isAppLoaded: state.app.isAppLoaded,
  isModalActive: state.app.modal.isModalActive,
  modalText: state.app.modal.text
});

export default connect(mapStateToProps)(App);