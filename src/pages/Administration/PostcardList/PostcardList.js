import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import './PostcardList.css';

import { getPostcards, deletePostcard } from '../../../actions/data';

function imgFormatter(cell) {
  return (
    <img src={`data:image/jpeg;base64,${cell}`} alt='Нет картинки' />
  );
}


class PostcardList extends Component {

  constructor(props) {
    super(props)

    this.state = {
      selected: [],
      postcardIdToDelete: null
    };
    this.columns = [{
      dataField: 'id',
      text: 'ID',
      hidden: true
    }, {
      dataField: 'photo',
      text: 'Картинка',
      formatter: imgFormatter,
      editable: false,
    },{
      dataField: 'vendorCode',
      text: 'Артикул'
    },{
      dataField: 'postcardType.type',
      text: 'Тип'
    },{
      dataField: 'price',
      text: 'Цена'
    }];

    this.updateSelectedPostcards = this.updateSelectedPostcards.bind(this);
    this.isPostcardSelected = this.isPostcardSelected.bind(this);
    this.createNewPostcard = this.createNewPostcard.bind(this);
    this.setPostcardToDelete = this.setPostcardToDelete.bind(this);
    this.resetPostcardToDelete = this.resetPostcardToDelete.bind(this);
    this.deleteSelectedPostcard = this.deleteSelectedPostcard.bind(this);
  }

  componentDidMount() {
    this.props.onGetPostcards();
  }

  updateSelectedPostcards() {
    const selectedUserId = this.state.selected[0];

    this.props.history.push(`/administration/postcards/edit/?id=${selectedUserId}`);
  }

  createNewPostcard() {
    this.props.history.push(`/administration/postcards/new`);
  }

  isPostcardSelected() {
    return !!this.state.selected[0];
  }

  setPostcardToDelete() {
    const postcardIdToDelete = this.state.selected[0];

    this.setState({postcardIdToDelete});
  }

  resetPostcardToDelete() {
    this.setState({
      postcardIdToDelete: null
    });
  }
  
  deleteSelectedPostcard() {
    this.props.onDeletePostcard(this.state.postcardIdToDelete);
    this.resetPostcardToDelete();
    this.setState({selected: []})
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
        <Modal isOpen={!!this.state.postcardIdToDelete}>
          <ModalBody>
            Удалить выбранную открытку?
          </ModalBody>
          <ModalFooter>
            <Button color="danger" size="sm" onClick={this.deleteSelectedPostcard}>Удалить</Button>
            <Button color="secondary" size="sm" onClick={this.resetPostcardToDelete}>Отменить</Button>
          </ModalFooter>
        </Modal>
      </div>
    );

    return (
      <div>
        {deleteConfirmationWindow}
        <div className='btn-container sticky-top bg-white d-block mt-2 mb-2'>
          <Button size="sm" outline className='mr-2' onClick={this.createNewPostcard}>Добавить</Button>
          <Button size="sm" outline className='mr-2' disabled={!this.isPostcardSelected()} onClick={this.updateSelectedPostcards}>Изменить</Button>
          <Button size="sm" outline className='mr-2' color='danger' disabled={!this.isPostcardSelected()} onClick={this.setPostcardToDelete}>Удалить</Button>
        </div>

        <BootstrapTable
          keyField="id"
          data={this.props.postcards}
          columns={this.columns}
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
    postcards: state.postcards.postcards
  }),
  dispatch => ({
    onGetPostcards: () => {
      dispatch(getPostcards());
    },
    onDeletePostcard: (id) => {
      dispatch(deletePostcard(id));
    }
  })
)(PostcardList);
