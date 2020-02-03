import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Collapse,
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button
} from 'reactstrap';
import { logout } from '../../actions/user';
import { connect } from 'react-redux';

import './navbar.css';

class NavbarComponent extends Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    let logoutButton = null;

    if (this.props.user) {
      logoutButton = (
        <Button size="sm" onClick={this.props.logout} outline>Выход</Button>
      );
    }

    return (
      <div>
        <Navbar color="dark" expand="md" className='mb-3'>
          <div className='container'>
            <NavbarBrand className="nav-link text-light">HdCorp</NavbarBrand>
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <Link className="nav-link" to="/balance">Остатки</Link>
                </NavItem>
                <NavItem>
                  <Link className="nav-link" to="/production">Производство</Link>
                </NavItem>
                <NavItem>
                  <Link className="nav-link" to="/sales">Продажи</Link>
                </NavItem>
                <UncontrolledDropdown nav inNavbar className='onTop'>
                  <DropdownToggle nav caret>
                    Администрирование
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem onClick={() => this.props.history.push(`/administration/postcards`)}>
                      Открытки
                    </DropdownItem>
                    <DropdownItem onClick={() => this.props.history.push(`/administration/employee`)}>
                      Сотрудники  
                    </DropdownItem>
                    <DropdownItem onClick={() => this.props.history.push(`/administration/clients`)}>
                      Клиенты
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
                {logoutButton}
              </Nav>
            </Collapse>
          </div>
        </Navbar>
      </div>
    );
  }
}

export default connect(
  state => ({
    user: state.user
  }),
  dispatch => ({
    logout: () => {
      dispatch(dispatch(logout))
    }
  })
)(NavbarComponent);