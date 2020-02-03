import { Button, Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import qs from 'qs'
import './ClientForm.css';

import { getClientDeltails, createClient } from '../../../../actions/data';

class ClientForm extends Component {
  constructor(props) {
    super(props);

    const parsed = qs.parse(props.location.search);
    const clientToUpdateId = parsed['?id'];

    this.state = {
      id: null,
      companyName: '',
      firstName: '',
      lastName: '',
      address: '',
      phone: '',
      email: '',
      comment: '',
      clientStores: [],
      newStoreModal: {
        show: false,
        country: '',
        city: '',
        street: ''
      },
      clientToUpdateId
    };

    this.handleChangeFirstName = this.handleChangeFirstName.bind(this);
    this.handleChangeLastName = this.handleChangeLastName.bind(this);
    this.handleChangeAddress = this.handleChangeAddress.bind(this);
    this.handleChangePhone = this.handleChangePhone.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangeCompany = this.handleChangeCompany.bind(this);
    this.handleChangeComment = this.handleChangeComment.bind(this);
    this.handleChangeNewStoreCountry = this.handleChangeNewStoreCountry.bind(this);
    this.handleChangeNewStoreCity = this.handleChangeNewStoreCity.bind(this);
    this.handleChangeNewStoreStreet = this.handleChangeNewStoreStreet.bind(this);
    this.deleteStore = this.deleteStore.bind(this);
    this.isClientFormValid = this.isClientFormValid.bind(this);
    this.submit = this.submit.bind(this);
    this.isNewStoreFormValid = this.isNewStoreFormValid.bind(this);
    this.hideNewStoreModal = this.hideNewStoreModal.bind(this);
    this.showNewStoreModal = this.showNewStoreModal.bind(this);
    this.cancelNewStore = this.cancelNewStore.bind(this);
    this.addNewStore = this.addNewStore.bind(this);
    this.resetNewStoreForm = this.resetNewStoreForm.bind(this);
  }

  componentWillMount() {
    const clientToUpdateId = this.state.clientToUpdateId;
    
    if (clientToUpdateId) {
      this.props.onGetClientDetails(clientToUpdateId);
    }
  }

  componentWillReceiveProps({ clientToUpdate }) {
    const { id, companyName, firstName, lastName, email, phone, address, rate, comment, clientStores } = clientToUpdate;

    this.setState({ id, companyName, firstName, lastName, email, phone, address, rate, comment, clientStores });
  }

  handleChangeFirstName(event) {
    this.setState({ firstName: event.target.value });
  }

  handleChangeLastName(event) {
    this.setState({ lastName: event.target.value });
  }

  handleChangeAddress(event) {
    this.setState({ address: event.target.value });
  }

  handleChangePhone(event) {
    this.setState({ phone: event.target.value });
  }

  handleChangeEmail(event) {
    this.setState({ email: event.target.value });
  }

  handleChangeCompany(event) {
    this.setState({ companyName: event.target.value });
  }

  handleChangeComment(event) {
    this.setState({ comment: event.target.value });
  }

  handleChangeNewStoreCountry(event) {
    const { newStoreModal } = this.state;

    newStoreModal.country = event.target.value;
    this.setState({ newStoreModal });
  }

  handleChangeNewStoreCity(event) {
    const { newStoreModal } = this.state;

    newStoreModal.city = event.target.value;
    this.setState({ newStoreModal });
  }

  handleChangeNewStoreStreet(event) {
    const { newStoreModal } = this.state;

    newStoreModal.street = event.target.value;
    this.setState({ newStoreModal });
  }

  isClientFormValid() {
    return false;
  }

  resetNewStoreForm() {
    const { newStoreModal } = this.state;
    newStoreModal.city = '';
    newStoreModal.country = '';
    newStoreModal.street = '';
    this.setState({ newStoreModal });
  }

  isNewStoreFormValid() {
    return (
      this.state.newStoreModal.country.length > 0 &&
      this.state.newStoreModal.city.length > 0 &&
      this.state.newStoreModal.street.length > 0
    );
  }

  deleteStore(storeToDelete) {
    let { clientStores } = this.state;

    if (storeToDelete.id) {
      storeToDelete.activeStatus = false;
    } else {
      clientStores = clientStores.filter(store => store.createTime !== storeToDelete.createTime);
    }
    this.setState({ clientStores });
  }

  showNewStoreModal() {
    const { newStoreModal } = this.state;

    newStoreModal.show = true;
    this.setState({ newStoreModal });
  }

  hideNewStoreModal() {
    const { newStoreModal } = this.state;
    newStoreModal.show = false;
    this.setState({ newStoreModal });
  }

  cancelNewStore() {
    this.hideNewStoreModal();
  }

  submit() {
    const clientModel = {
      id: null,
      companyName: null,
      firstName: null,
      lastName: null,
      email: null,
      phone: null,
      comment: null,
      clientStores: []
    };

    function addStoreToModel({ id = null, country, city, street, activeStatus }) {
      const storeModel = {
        country: null,
        city: null,
        street: null,
        activeStatus: null
      };
      storeModel.id = id;
      storeModel.country = country;
      storeModel.city = city;
      storeModel.street = street;
      storeModel.activeStatus = activeStatus;

      clientModel.clientStores.push(storeModel);
    }

    clientModel.id = this.state.id;
    clientModel.companyName = this.state.companyName;
    clientModel.firstName = this.state.firstName;
    clientModel.lastName = this.state.lastName;
    clientModel.email = this.state.email;
    clientModel.phone = this.state.phone;
    clientModel.comment = this.state.comment;

    this.state.clientStores.forEach(store => addStoreToModel(store));

    this.props.onCreateNewClient(clientModel);
    this.props.history.push('/administration/clients/');
  }

  addNewStore() {
    const { clientStores } = this.state;
    const newStore = {
      city: this.state.newStoreModal.city,
      country: this.state.newStoreModal.country,
      street: this.state.newStoreModal.street,
      activeStatus: true,
      createTime: Date.now()
    };

    clientStores.push(newStore);

    this.setState({ clientStores });
    this.hideNewStoreModal();
    this.resetNewStoreForm();
  }

  render() {
    const storesToShow = this.state.clientStores.filter(store => store.activeStatus === true);
    const newStoreModalWindow = (
      <div>
        <Modal isOpen={this.state.newStoreModal.show}>
          <ModalHeader>
            Новый магазин
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="newStoreCountry">Страна</Label>
              <Input type="text" name="newStoreCountry" id="newStoreCountry" placeholder="Введите страну" value={this.state.newStoreModal.country} onChange={this.handleChangeNewStoreCountry} />
            </FormGroup>
            <FormGroup>
              <Label for="newStoreCity">Город</Label>
              <Input type="text" name="newStoreCity" id="newStoreCity" placeholder="Введите город" value={this.state.newStoreModal.city} onChange={this.handleChangeNewStoreCity} />
            </FormGroup>
            <FormGroup>
              <Label for="newStoreAddress">Адрес</Label>
              <Input type="text" name="newStoreAddress" id="newStoreAddress" placeholder="Введите адрес" value={this.state.newStoreModal.street} onChange={this.handleChangeNewStoreStreet} />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" size="sm" onClick={this.addNewStore} disabled={!this.isNewStoreFormValid()} >Добавить</Button>
            <Button color="secondary" size="sm" onClick={this.hideNewStoreModal}>Отменить</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
    const storeList = this.state.clientStores.length > 0
      ? (<ul>
        {storesToShow.map(
          (store, index) => (
            <li key={index}>
              <span className='storeItem'>{`${store.country}, ${store.city}, ${store.street}`}</span>
              <button type="button" className="close" aria-label="Close" onClick={() => { this.deleteStore(store) }} label='qweqwe'>
                <span aria-hidden="true">&times;</span>
              </button>
            </li>
          )
        )
        }
      </ul>)
      : (<div className='ml-4 mb-3'>Нет магазинов</div>);

    const confirmButton = this.state.id === null
      ? <Button color='primary' className='mr-2' disabled={this.isClientFormValid()} onClick={this.submit}>Добавить</Button>
      : <Button color='primary' className='mr-2' disabled={this.isClientFormValid()} onClick={this.submit}>Изменить</Button>

    return (
      <Form className='add-item-form mb-5'>
        {newStoreModalWindow}
        <FormGroup>
          <Label for="firstName">Компаниня</Label>
          <Input type="text" name="company" id="company" placeholder="Введите название компании" value={this.state.companyName} onChange={this.handleChangeCompany} />
        </FormGroup>
        <FormGroup>
          <Label for="firstName">Имя</Label>
          <Input type="text" name="firstName" id="firstName" placeholder="Введите имя" value={this.state.firstName} onChange={this.handleChangeFirstName} />
        </FormGroup>
        <FormGroup>
          <Label for="lastname">Фамилия</Label>
          <Input type="text" name="lastname" id="lastname" placeholder="Введите фамилию" value={this.state.lastName} onChange={this.handleChangeLastName} />
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
          <Label for="comment">Комментарий</Label>
          <Input type="text" name="comment" id="comment" placeholder="Введите комментарий" value={this.state.comment} onChange={this.handleChangeComment} />
        </FormGroup>
        <FormGroup className='mb-5'>
          <Label for="store">Магазины</Label>
          {storeList}
          <Button outline size='sm' color='primary' onClick={this.showNewStoreModal}>Добавить магазин</Button>
        </FormGroup>
        {confirmButton}
        <Button onClick={this.props.history.goBack}>Отменить</Button>
      </Form>
    );
  }
}

export default connect(
  state => ({
    clientToUpdate: state.clients.clientToUpdate
  }),
  dispatch => ({
    onGetClientDetails: id => {
      dispatch(getClientDeltails(id));
    },
    onCreateNewClient: client => {
      dispatch(createClient(client));
    }
  })
)(ClientForm);