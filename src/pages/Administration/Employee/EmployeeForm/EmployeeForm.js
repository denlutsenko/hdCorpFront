import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import qs from 'qs'
import './EmployeeForm.css';

import { getRoles, getUserDetails, updateUser, clearUserToUpdate } from '../../../../actions/data';

const EMPTY = '...';

class EmployeeForm extends Component {
  constructor(props) {
    super(props);

    const parsed = qs.parse(props.location.search);
    const userToUpdateId = parsed['?id'];

    this.state = {
      id: '',
      firstName: '',
      lastName: '',
      password: '',
      passwordConfirm: '',
      address: '',
      phone: '',
      email: '',
      rate: false,
      role: null,
      userToUpdateId
    };

    this.handleChangeFirstName = this.handleChangeFirstName.bind(this);
    this.handleChangeLastName = this.handleChangeLastName.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleChangePasswordConfirm = this.handleChangePasswordConfirm.bind(this);
    this.handleChangeAddress = this.handleChangeAddress.bind(this);
    this.handleChangePhone = this.handleChangePhone.bind(this);
    this.handleChangeRole = this.handleChangeRole.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangeRate = this.handleChangeRate.bind(this);
    this.isValidForm = this.isValidForm.bind(this);
    this.getUserRoleId = this.getUserRoleId.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentDidMount() {
    const userToUpdateId = this.state.userToUpdateId;

    this.props.getRoleList();
    if(userToUpdateId) {
      this.props.onGetUserToUpdate(userToUpdateId);
    }
  }

  componentWillReceiveProps({ userToUpdate }) {
    if (userToUpdate.id) {
      const { address, email, firstName, lastName, id, phone, rate, role } = userToUpdate;

      this.setState({ address, email, firstName, lastName, id, phone, rate, role });
    } else {
      const address = sessionStorage.getItem('address') || '';
      const email = sessionStorage.getItem('email') || '';
      const firstName = sessionStorage.getItem('firstName') || '';
      const lastName = sessionStorage.getItem('lastName') || '';
      const phone = sessionStorage.getItem('phone') || '';
      const rate = sessionStorage.getItem('rate') === 'true' ? true : false;
      const role = JSON.parse(sessionStorage.getItem('role')) || null;

      this.setState({ address, email, firstName, lastName, phone, rate, role });
    }
  }

  componentWillUnmount() {
    sessionStorage.clear();
    this.props.onClearUserToUpdate();
  }

  handleChangeFirstName(event) {
    const  firstName = event.target.value;

    sessionStorage.setItem('firstName', firstName);
    this.setState({ firstName });
  }

  handleChangeLastName(event) {
    const lastName = event.target.value;

    sessionStorage.setItem('lastName', lastName);
    this.setState({ lastName: event.target.value });
  }

  handleChangePassword(event) {
    this.setState({ password: event.target.value });
  }

  handleChangePasswordConfirm(event) {
    this.setState({ passwordConfirm: event.target.value });
  }

  handleChangeAddress(event) {
    const address = event.target.value;

    sessionStorage.setItem('address', address);
    this.setState({ address });
  }

  handleChangePhone(event) {
    const phone = event.target.value;

    sessionStorage.setItem('phone', phone);
    this.setState({ phone });
  }

  handleChangeEmail(event) {
    const email = event.target.value;

    sessionStorage.setItem('email', email);
    this.setState({ email });
  }

  handleChangeRole(event) {   
    if (event.target.value === EMPTY) {
      this.setState({ role: null });
    } else {
      const role = JSON.parse(event.target.value);
      console.log();
      sessionStorage.setItem('role', event.target.value);
      this.setState({ role });
    }
  }

  handleChangeRate(event) {
    const rate = event.target.checked;

    sessionStorage.setItem('rate', rate);
    this.setState({ rate });
  }

  isValidForm() {
    return (
      this.state.firstName.length > 0 &&
      this.state.lastName.length > 0 &&
      this.state.password === this.state.passwordConfirm &&
      this.state.address.length > 0 &&
      this.state.email.length > 0 &&
      this.state.role);
  }

  getUserRoleId() {
    return this.props.userToUpdate.role.id;
  }

  submit() {
    const model = {
      id: null,
      firstName: null,
      lastName: null,
      email: null,
      password: null,
      address: null,
      phone: null,
      rate: null,
      role: {
        id: null
      }
    };

    model.id = this.state.id;
    model.firstName = this.state.firstName;
    model.lastName = this.state.lastName;
    model.email = this.state.email;
    model.password = this.state.password;
    model.address = this.state.address;
    model.phone = this.state.phone;
    model.rate = this.state.rate;
    model.role = this.state.role
    model.rate = this.state.rate;

    this.props.updateUser(model);
    this.props.history.push('/administration/employee/');
  }

  render() {
    return (
      <Form className='add-item-form mb-5'>
        <FormGroup>
          <Label for="firstName">Имя</Label>
          <Input type="text" name="firstName" id="firstName" placeholder="Введите имя" value={this.state.firstName} onChange={this.handleChangeFirstName}/>
        </FormGroup>
        <FormGroup>
          <Label for="lastname">Фамилия</Label>
          <Input type="text" name="lastname" id="lastname" placeholder="Введите фамилию" value={this.state.lastName} onChange={this.handleChangeLastName} />
        </FormGroup>
        <FormGroup>
          <Label for="password">Новый пароль</Label>
          <Input type="password" name="password" id="password" placeholder="Придумайте новый пароль" value={this.state.password} onChange={this.handleChangePassword} />
        </FormGroup>
        <FormGroup>
          <Label for="passwordConfirm">Повторите новый пароль</Label>
          <Input type="password" name="passwordConfirm" id="passwordConfirm" placeholder="Введите новый пароль" value={this.state.passwordConfirm} onChange={this.handleChangePasswordConfirm} />
        </FormGroup>
        <FormGroup>
          <Label for="address">Адрес</Label>
          <Input type="text" name="address" id="address" placeholder="Введите адрес" value={this.state.address} onChange={this.handleChangeAddress} />
        </FormGroup>
        <FormGroup>
          <Label for="phone">Телефон</Label>
          <Input type="text" name="phone" id="phone" placeholder="Введите номер телефона" value={this.state.phone} onChange={this.handleChangePhone} />
        </FormGroup>
        <FormGroup>
          <Label for="email">Email</Label>
          <Input type="email" name="email" id="email" placeholder="Введите email" value={this.state.email} onChange={this.handleChangeEmail} />
        </FormGroup>
        <FormGroup>
          <Label check>
            <Input type="checkbox" checked={this.state.rate} onChange={this.handleChangeRate} />
            Ставочник
          </Label>
        </FormGroup>
        <FormGroup>
          <Label for="role">Роль</Label>
          <Input type="select" name="role" id="role" onChange={this.handleChangeRole} value={JSON.stringify(this.state.role)}>
            <option>{EMPTY}</option>
            {this.props.roleList.map(role =>
              (<option key={role.id} value={JSON.stringify(role)}>{role.role}</option>)
            )}
          </Input>
        </FormGroup>
        <Button color='primary' className='mr-2' disabled={!this.isValidForm()} onClick={this.submit}>Сохранить</Button>
        <Button onClick={this.props.history.goBack}>Отменить</Button>
      </Form>
    );
  }
}

export default connect(
  state => ({
    roleList: state.employee.roleList,
    userToUpdate: state.employee.userToUpdate
  }),
  dispatch => ({
    updateUser: (user) => {
      dispatch(updateUser(user));
    },
    getRoleList: () => {
      dispatch(getRoles());
    },
    onGetUserToUpdate: (userId) => {
      dispatch(getUserDetails(userId));
    },
    onClearUserToUpdate: () => {
      dispatch(clearUserToUpdate());
    }
  })
)(EmployeeForm);