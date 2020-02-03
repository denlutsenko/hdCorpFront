import React, { Component } from 'react';
import { connect } from 'react-redux';
import cellEditFactory from 'react-bootstrap-table2-editor';
import BootstrapTable from 'react-bootstrap-table-next';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button } from 'reactstrap';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';

import { getCardListForSale, sendSoldPostcards, showModal } from '../../actions/data';

const { SearchBar } = Search;

function imgFormatter(cell) {
  return (
    <img src={`data:image/jpeg;base64,${cell}`} alt='Нет картинки' />
  );
}

class SalesPage extends Component {

  constructor(props) {
    super(props)

    this.columns = [{
      dataField: 'id',
      text: 'ID',
      hidden: true
    }, {
      dataField: 'number',
      text: '#',
      editable: false,
      sort: true
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
      dataField: 'price',
      text: 'Цена',
      editable: false,
      sort: true
    }, {
      dataField: 'remain.quantity',
      text: 'Остаток',
      editable: false,
      sort: true
    }, {
      dataField: 'sold',
      text: 'Продано',
      validator: (newValue) => {
        if (isNaN(newValue) || newValue < 1) {
          return {
            valid: false
          };
        }
        return true;
      }
    }];

    this.state = {
      dropdownClientOpen: false,
      dropdownShopOpen: false,
      selectedClient: {
        id: null
      },
      selectedStore: {}
    };

    this.toggle = this.toggle.bind(this);
    this.submit = this.submit.bind(this);
    this.canSubmit = this.canSubmit.bind(this);
    this.selectClient = this.selectClient.bind(this);
  }

  componentDidMount() {
    this.props.onLoadCardsForSale();
  }

  toggle(elem) {
    this.setState(prevState => ({
      [elem]: !prevState[elem]
    }));
  }

  selectClient(client) {
    const state = this.state;

    if (!(state.selectedClient.id === client.id)) {
      this.setState({ selectedStore: {} });
    }
    this.setState({ selectedClient: client });
  }

  selectedStore(store) {
    this.setState({ selectedStore: store });
  }


  submit() {
    const model = {
      clientId: null,
      storeID: null,
      postcards: []
    };

    const setClientId = ({ id }) => {
      model.clientId = id;
    }

    const setStoreId = ({ id }) => {
      model.storeID = id;
    }

    const addPostcardToModel = (postcards) => {
      postcards.forEach(({ id: postcardId, sold: quantity, price }) => {
        quantity = Number(quantity);
        model.postcards.push({ postcardId, quantity, price });
      });
    }

    let cardsToSend = this.props.postCards.slice();
    cardsToSend = cardsToSend.filter(card => card.sold > 0);
    
    if (cardsToSend.length === 0) {
      this.props.onShowModal('Нет открыток для добавления');
    } else {
      setClientId(this.state.selectedClient);
      setStoreId(this.state.selectedStore)
      addPostcardToModel(cardsToSend);
  
      this.props.onSubmitSoldPostcards(model);
      this.clearDropdowns();
    }
  }

  clearDropdowns() {
    this.setState({
      selectedClient: {
        id: null
      },
      selectedStore: {}
    });
  }

  canSubmit() {
    return this.state.selectedClient.id && this.state.selectedStore.id;
  }

  render() {
    let shopDropdown = (this.state.selectedClient.id)
      ? (
        <Dropdown
          isOpen={this.state.dropdownShopOpen}
          toggle={() => { this.toggle('dropdownShopOpen') }}
          className='employeeDropdown mr-2'
          size="sm">
          <DropdownToggle caret>
            Магазин
        </DropdownToggle>
          <DropdownMenu>
            {this.state.selectedClient.clientStores.map(
              store => {
                return (
                  <DropdownItem key={store.id} onClick={() => this.selectedStore(store)}>
                    {`${store.city}, ${store.street}`}
                  </DropdownItem>
                );
              }
            )}
          </DropdownMenu>
        </Dropdown>)
      : null;

    let selectedClientSpan = (this.state.selectedClient.id)
      ? <p>{`Клиент: ${this.state.selectedClient.firstName} ${this.state.selectedClient.lastName}, ${this.state.selectedClient.companyName}`}</p>
      : null;

    let selectedShopSpan = (this.state.selectedStore.id)
      ? <p>{`Магазин: ${this.state.selectedStore.city}, ${this.state.selectedStore.street}`}</p>
      : null;

    return (
      <div>
        <div className='btn-container sticky-top bg-white d-block'>
          <Dropdown
            isOpen={this.state.dropdownClientOpen}
            toggle={() => { this.toggle('dropdownClientOpen') }}
            className='employeeDropdown mr-2'
            size="sm">
            <DropdownToggle caret>
              Клиент
          </DropdownToggle>
            <DropdownMenu>
              {this.props.clients.map(
                сlient => {
                  return (
                    <DropdownItem key={сlient.id} onClick={() => this.selectClient(сlient)}>
                      {`${сlient.companyName}`}
                    </DropdownItem>
                  );
                }
              )}
            </DropdownMenu>
          </Dropdown>
          {shopDropdown}
          <Button color="primary" onClick={this.submit} size="sm" outline disabled={!this.canSubmit()} className='mr-2'>Добавить</Button>
          <Button size="sm" onClick={this.props.onLoadCardsForSale} outline>Обновить</Button>
        </div>

        <div>
          {selectedClientSpan}
          {selectedShopSpan}
        </div>

        <ToolkitProvider
          keyField="id"
          data={this.props.postCards}
          columns={this.columns}
          search
        >
          {
            props => (
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
              </div>
            )
          }
        </ToolkitProvider>
      </div>

    );
  }
}

export default connect(
  (state) => {
    const { postcards: postCards } = state.sales.salesPageData;
    // eslint-disable-next-line
    postCards.map((card, index) => {
      card.sold = 0;
      card.number = index + 1;
    });

    return {
      postCards,
      clients: state.sales.salesPageData.clients,
    }
  },
  (dispatch) => ({
    onLoadCardsForSale: () => {
      dispatch(getCardListForSale());
    },
    onSubmitSoldPostcards: (data) => {
      dispatch(sendSoldPostcards(data));
    },
    onShowModal: (text) => {
      dispatch(showModal(text));
    }
  })
)(SalesPage);
