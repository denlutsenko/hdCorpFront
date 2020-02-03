import React, { Component } from 'react';
import { connect } from 'react-redux';
import cellEditFactory from 'react-bootstrap-table2-editor';
import BootstrapTable from 'react-bootstrap-table-next';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button } from 'reactstrap';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';

import { getCardListForProduction, postProducedPostcards, showModal } from '../../actions/data';
const { SearchBar } = Search;

function imgFormatter(cell) {
  return (
    <img src={`data:image/jpeg;base64,${cell}`} alt='Нет картинки' />
  );
}

class ProductionPage extends Component {

  constructor(props) {
    super(props);

    this.columns = [{
      dataField: 'id',
      text: 'ID',
      hidden: true
    }, {
      dataField: 'number',
      text: '#',
      editable: false
    }, {
      dataField: 'photo',
      text: 'Картинка',
      formatter: imgFormatter,
      editable: false,
    }, {
      dataField: 'vendorCode',
      text: 'Артикул',
      editable: false,
      sort: true
    }, {
      dataField: 'postcardType.type',
      text: 'Тип',
      editable: false,
      sort: true
    }, {
      dataField: 'remain.quantity',
      text: 'Остаток',
      editable: false,
      sort: true
    }, {
      dataField: 'produced',
      text: 'Произведено',
      validator: (newValue) => {
        if (isNaN(newValue) || newValue < 1) {
          return { valid: false };
        }
        return true;
      }
    }];

    this.state = {
      dropdownOpen: false,
      selectedUser: {
        id: '',
        firstName: '',
        lastName: ''
      }
    };

    this.toggle = this.toggle.bind(this);
    this.selectEmployee = this.selectEmployee.bind(this);
    this.submit = this.submit.bind(this);
    this.canSubmit = this.canSubmit.bind(this);
  }

  componentDidMount() {
    this.props.onLoadCardsForProduction();
  }

  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  selectEmployee(user) {
    this.setState({ selectedUser: user });
  }

  submit() {
    const productionListModel = {
      userId: null,
      postcards: []
    };

    const setUserId = ({ id }) => {
      productionListModel.userId = id;
    }

    const addPostcardToModel = (postcards) => {
      postcards.forEach(({ id: postcardId, produced: quantity }) => {
        quantity = Number(quantity);
        productionListModel.postcards.push({ postcardId, quantity });
      });
    }

    let cardsToSend = this.props.postCards.slice();
    cardsToSend = cardsToSend.filter(card => card.produced > 0);

    if (cardsToSend.length === 0) {
      this.props.onShowModal('Нет открыток для добавления');
    } else {
      setUserId(this.state.selectedUser);
      addPostcardToModel(cardsToSend);
  
      this.setState({
        selectedUser: {
          id: '',
          firstName: '',
          lastName: ''
        }
      });
  
      this.props.onSubmit(productionListModel);
    }
  }

  canSubmit() {
    return this.state.selectedUser.id;
  }

  render() {
    const selectedEmp = (this.state.selectedUser.id)
      ? <p>{`Выбраный сотрудник : ${this.state.selectedUser.firstName} ${this.state.selectedUser.lastName}`}</p>
      : <p>Выберите сотрудника</p>;
    const empDropdown = (
      <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle} className='employeeDropdown mr-2' size="sm">
        <DropdownToggle caret>
          Сотрудники
        </DropdownToggle>
        <DropdownMenu>
          {this.props.users.map(
            user => {
              return (
                <DropdownItem key={user.id} onClick={() => this.selectEmployee(user)}>
                  {`${user.firstName} ${user.lastName}`}
                </DropdownItem>
              );
            }
          )}
        </DropdownMenu>
      </Dropdown>);

    return (
      <div>
        <div className='btn-container sticky-top bg-white d-block mt-2 mb-2'>
          {empDropdown}
          <Button className='mr-2' color="primary" onClick={this.submit} size="sm" outline disabled={!this.canSubmit()}>Добавить</Button>
          <Button onClick={this.props.onLoadCardsForProduction} size="sm" outline>Обновить</Button>
        </div>

        {selectedEmp}

        <ToolkitProvider
          keyField="id"
          data={this.props.postCards}
          columns={this.columns}
          search>
          {props => (
            <div>
              <SearchBar {...props.searchProps} />
              <hr />
              <BootstrapTable
                {...props.baseProps}
                striped
                condensed
                cellEdit={cellEditFactory({
                  mode: 'click',
                  blurToSave: true
                })}
              />
            </div>)
          }
        </ToolkitProvider>
      </div>
    );
  }
}

export default connect(
  (state) => {
    const { postcards: postCards } = state.production.productionPageData;
    // eslint-disable-next-line
    postCards.map((card, index) => {
      card.produced = 0;
      card.number = index + 1;
    });
    return {
      postCards,
      users: state.production.productionPageData.users
    }
  },
  (dispatch) => ({
    onLoadCardsForProduction: () => {
      dispatch(getCardListForProduction());
    },
    onSubmit: (data) => {
      dispatch(postProducedPostcards(data));
    },
    onShowModal: (text) => {
      dispatch(showModal(text));
    }
  })
)(ProductionPage);
