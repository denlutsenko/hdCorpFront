import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';
import { connect } from 'react-redux';
import BootstrapTable from 'react-bootstrap-table-next';


import { getClients, deleteClient } from '../../../actions/data';

class ClietsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: [],
      columns: [
        {
        dataField: 'id',
        text: 'ID',
        hidden: true
      }, {
        dataField: 'companyName',
        text: 'Компания'
      }, {
        dataField: 'firstName',
        text: 'Имя'
      }, {
        dataField: 'lastName',
        text: 'Фамилия'
      }, {
        dataField: 'phone',
        text: 'Телефон'
      }, {
        dataField: 'email',
        text: 'Email'
      }],
      selectedToDeleteClientId: null
    };

    this.updateSelectedUser = this.updateSelectedUser.bind(this);
    this.isUserSelected = this.isUserSelected.bind(this);
    this.createNewClient = this.createNewClient.bind(this);
    this.deleteSelectedClient = this.deleteSelectedClient.bind(this);
    this.resetUserToDelete = this.resetUserToDelete.bind(this);
    this.setClientToDelete = this.setClientToDelete.bind(this);
    
    this.props.getUserList();
  }

  isUserSelected() {
    return !!this.state.selected[0];
  }

  updateSelectedUser() {
    const selectedUserId = this.state.selected[0];

    this.props.history.push(`/administration/clients/edit/?id=${selectedUserId}`);
  }

  createNewClient() {
    this.props.history.push(`/administration/clients/new`);
  }

  setClientToDelete() {
    const selectedToDeleteClientId = this.state.selected[0];

    this.setState({selectedToDeleteClientId});
  }

  deleteSelectedClient() {
    const selectedClientId = this.state.selected[0];

    this.props.onDeleteClient(selectedClientId);
    this.resetUserToDelete();
  }

  resetUserToDelete() {
    this.setState({ selected: [], selectedToDeleteClientId: null });
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
        <Modal isOpen={!!this.state.selectedToDeleteClientId}>
          <ModalBody>
            Удалить выбранного клиента?
          </ModalBody>
          <ModalFooter>
            <Button color="danger" size="sm" onClick={this.deleteSelectedClient}>Удалить</Button>
            <Button color="secondary" size="sm" onClick={this.resetUserToDelete}>Отменить</Button>
          </ModalFooter>
        </Modal>
      </div>
    );

    return (
      <div>
        {deleteConfirmationWindow}
        <div className='btn-container sticky-top bg-white d-block mt-2 mb-2'>
          <Button size="sm" outline className='mr-2' onClick={this.createNewClient}>Добавить</Button>
          <Button size="sm" outline className='mr-2' disabled={!this.isUserSelected()} onClick={this.updateSelectedUser}>Изменить</Button>
          <Button size="sm" outline className='mr-2' color='danger' disabled={!this.isUserSelected()} onClick={this.setClientToDelete}>Удалить</Button>
        </div>

        <BootstrapTable
          keyField="id"
          data={this.props.clients}
          columns={this.state.columns}
          selectRow={selectRow}
          striped
          condensed
        />
      </div>
    );
  }
}

export default connect(
  state => ({
    clients: state.clients.clients
  }),
  dispatch => ({
    getUserList: () => {
      dispatch(getClients());
    },
    onDeleteClient: id => {
      dispatch(deleteClient(id));
    }
  })
)(ClietsPage);