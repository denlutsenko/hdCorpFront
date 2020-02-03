import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';

import { getBalanceData } from '../../actions/data';

const { SearchBar } = Search;

function imgFormatter(cell) {
  return (
    <img src={`data:image/jpeg;base64,${cell}`} alt='Нет картинки' />
  );
}

class Report extends Component {

  constructor(props) {
    super(props);

    this.state = {
      monthsDropdownOpen: false,
      selectedMonth: null,
      columns: [{
        dataField: 'id',
        text: 'Product ID',
        hidden: true
      }, {
        dataField: 'number',
        text: '#',
        sort: true
      }, {
        dataField: 'photo',
        text: 'Картинка',
        formatter: imgFormatter,
        editable: false,
      }, {
        dataField: 'postcardType',
        text: 'Тип',
        sort: true
      }, {
        dataField: 'vendorCode',
        text: 'Артикул',
        sort: true
      }, {
        dataField: 'currProduced',
        text: 'Произведено за месяц',
        sort: true
      }, {
        dataField: 'currOrdered',
        text: 'Заказано за месяц',
        sort: true
      }, {
        dataField: 'firstDayRemain',
        text: 'Остаток на первый день месяца',
        sort: true
      }, {
        dataField: 'currRemain',
        text: 'Остаток на последний день месяца',
        sort: true
      }]
    };

    this.toggle = this.toggle.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  componentDidMount() {
    this.props.onGetReport(this.state.selectedMonth);
  }

  toggle(elem) {
    this.setState(prevState => ({
      [elem]: !prevState[elem]
    }));
  }

  selectMonth(month) {
    this.props.onGetReport(month);
    this.setState({ selectedMonth: month });
  }

  refresh() {
    this.setState({ selectedMonth: null });
    this.props.onGetReport();
  }

  render() {
    const selectedMonth = (this.state.selectedMonth)
      ? <p className='m-2'>{`Выбраный месяц : ${this.state.selectedMonth}`}</p>
      : <p className='m-2'>{`Выбран текущий месяц`}</p>;
    
    const refreshButton = <Button onClick={this.refresh} size="sm" expand="mb" outline>Обновить</Button>;
    const buttonContainer = (
      <div>
        <Dropdown className='d-inline mr-2' isOpen={this.state.monthsDropdownOpen} toggle={() => this.toggle('monthsDropdownOpen')} size="sm">
          <DropdownToggle caret>
            Месяцы
        </DropdownToggle>
          <DropdownMenu>
            {this.props.months.map(
              (month, index) => {
                return (
                  <DropdownItem key={index} onClick={() => this.selectMonth(month)}>
                    {month}
                  </DropdownItem>
                );
              }
            )}
          </DropdownMenu>
        </Dropdown>
        {refreshButton}
        {selectedMonth}
      </div>);

    return (
      <div>
        {buttonContainer}
        <ToolkitProvider
          keyField="id"
          data={this.props.balance}
          columns={this.state.columns}
          search>
          {props => (
            <div>
              <SearchBar {...props.searchProps} />
              <hr />
              <BootstrapTable
                {...props.baseProps}
                striped
                condensed
              />
            </div>)
          }
        </ToolkitProvider>
      </div>
    );
  }
}

export default connect(
  state => {
    let { accounting } = state.balance.balancePageData;

    function addNumbering(arr) {
      // eslint-disable-next-line
      arr.map((item, index) => {
        item.number = index + 1;
      });
    }
    addNumbering(accounting);

    return {
      balance: accounting,
      postcardTypes: state.balance.balancePageData.postcardTypes,
      months: state.balance.balancePageData.months,
    }
  },
  dispatch => ({
    onGetReport: month => {
      dispatch(getBalanceData(month));
    }
  })
)(Report);