import { Nav, NavItem } from 'reactstrap';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class AdministrationPage extends Component {
  render() {
    return (
      <div className='mb-2'>
        <Nav>
          <NavItem>
            <Link className='text-dark mr-4 d-block' to={'/administration/postcards'}>Открытки</Link>
          </NavItem>
          <NavItem>
            <Link className='text-dark mr-4 d-block' to={'/administration/employee'}>Сотрудники</Link>
          </NavItem>
          <NavItem>
            <Link className='text-dark mr-4 d-block' to={'/administration/clients'}>Клиенты</Link>
          </NavItem>
        </Nav>
      </div>
    );
  }
}

export default AdministrationPage;