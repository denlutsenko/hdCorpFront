import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';
import { connect } from 'react-redux';
import BootstrapTable from 'react-bootstrap-table-next';


import { getUserList, deleteUser } from '../../../actions/data';

class EmployeePage extends Component {
  constructor(props) {
    super(props);


    this.state = {
      userToDeleteId: null,
      selected: [],
      columns: [{
        dataField: 'id',
        text: 'ID',
        hidden: true
      }, {
        dataField: 'firstName',
        text: 'Имя'
      }, {
        dataField: 'lastName',
        text: 'Фамилия'
      }, {
        dataField: 'address',
        text: 'Адрес'
      }, {
        dataField: 'phone',
        text: 'Телефон'
      }, {
        dataField: 'email',
        text: 'Email'
      }, {
        dataField: 'role.role',
        text: 'Роль'
      }]
    };
    this.isUserSelected = this.isUserSelected.bind(this);
    this.setUserToDelete = this.setUserToDelete.bind(this);
    this.updateSelectedUser = this.updateSelectedUser.bind(this);
    this.redirectToCreatePage = this.redirectToCreatePage.bind(this);

    this.props.onGetUsers();
  }

  isUserSelected() {
    return !!this.state.selected[0];
  }

  redirectToCreatePage() {
    this.props.history.push('/administration/employee/new');
    this.setState({ selected: [] });
  }

  setUserToDelete() {
    const userToDeleteId = this.state.selected[0];

    this.setState({userToDeleteId});
  }

  deleteSelectedUser() {
    this.setState({ selected: [] });
    this.props.onDeleteUser(this.state.userToDeleteId);
    this.cancelDelete();
  }

  updateSelectedUser() {
    const selectedUserId = this.state.selected[0];

    this.props.history.push(`/administration/employee/edit/?id=${selectedUserId}`);
  }

  cancelDelete() {
    this.setState({ selected: [] });
    this.setState({userToDeleteId : null});
  }

  render() {
    const selectRow = {
      mode: 'radio',
      selected: this.state.selected,
      onSelect: (row) => {
        this.setState(() => ({
          selected: [row.id]
        }));
      }
    };

    const deleteConfirmationWindow = (
      <div>
        <Modal isOpen={!!this.state.userToDeleteId}>
          <ModalBody>
            Удалить выбранного сотрудника?
          </ModalBody>
          <ModalFooter>
            <Button color="danger" size="sm" onClick={this.deleteSelectedUser.bind(this)}>Удалить</Button>
            <Button color="secondary" size="sm" onClick={this.cancelDelete.bind(this)}>Отменить</Button>
          </ModalFooter>
        </Modal>
      </div>
    );

    return (
      <div>
        <div className='btn-container sticky-top bg-white d-block mt-2 mb-2'>
          <Button size="sm" outline className='mr-2' onClick={this.redirectToCreatePage}>Добавить</Button>
          <Button size="sm" outline className='mr-2' onClick={this.updateSelectedUser} disabled={!this.isUserSelected()}>Изменить</Button>
          <Button size="sm" outline className='mr-2' color="danger" onClick={this.setUserToDelete} disabled={!this.isUserSelected()}>Удалить</Button>
        </div>

        <BootstrapTable
          keyField="id"
          data={this.props.users}
          columns={this.state.columns}
          selectRow={selectRow}
          striped
          condensed
        />
        {deleteConfirmationWindow}
      </div>
    );
  }
}

export default connect(
  state => ({
    users: state.employee.userList.users,
    userToDeleteId: state.employee.userToDeleteId
  }),
  dispatch => ({
    onGetUsers: () => {
      dispatch(getUserList());
    },
    onDeleteUser: (userId) => {
      dispatch(deleteUser(userId));
    }
  })
)(EmployeePage);