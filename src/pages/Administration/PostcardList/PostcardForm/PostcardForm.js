import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { connect } from 'react-redux';
import qs from 'qs'

import { 
  getPostcardDetails, 
  getPostcardTypes, 
  createPostcard, 
  updatePostcard, 
  clearPostcardToDelete } from '../../../../actions/data';

const EMPTY = '...';

class PostcardForm extends Component {
  constructor(props) {
    super(props);
  
    const parsed = qs.parse(this.props.location.search);
    const postcardToUpdateId = parsed['?id'];

    this.state = {
      id: null,
      vendorCode: '',
      price: '',
      postcardType: null,
      file: null,
      postcardToUpdateId
    };
    
    this.handleChangeVendorCode = this.handleChangeVendorCode.bind(this);
    this.handleChangePrice = this.handleChangePrice.bind(this);
    this.handleChangeCardtype = this.handleChangeCardtype.bind(this);
    this.handleChangeFile = this.handleChangeFile.bind(this);
    this.submit = this.submit.bind(this);
    this.back = this.back.bind(this);
  }

  componentDidMount() {
    const postcardToUpdateId = this.state.postcardToUpdateId;

    this.props.onGetPostcardTypes();
    if (postcardToUpdateId) {
      this.props.onGetPostcardDetail(postcardToUpdateId);
    }
  }

  componentWillReceiveProps({ postcardToUpdate }) {
    if (!postcardToUpdate.id) {
      const vendorCode = sessionStorage.getItem('vendorCode') || '';
      const price = sessionStorage.getItem('price') || '';
      const postcardType = JSON.parse(sessionStorage.getItem('postcardType')) || null;
      
      this.setState({vendorCode, price, postcardType});
    } else {
      const { id = null, 
        vendorCode = '', 
        price = '', 
        remain = null, 
        activeStatus = null,
        postcardType } = postcardToUpdate;

        this.setState({ id, vendorCode, price, remain, activeStatus, postcardType });
    } 
  }

  componentWillUnmount() {
    sessionStorage.clear();
    this.props.onClearPostcardToUpdate();
  }
  
  handleChangeVendorCode(e) {
    const vendorCode = e.target.value;

    sessionStorage.setItem('vendorCode', vendorCode);
    this.setState({vendorCode});
  }
  
  handleChangePrice(e) {
    const price =  e.target.value;

    sessionStorage.setItem('price', price);
    this.setState({price});
  }
  
  handleChangeCardtype(e) {
    if (e.target.value !== EMPTY) {
      const postcardType = JSON.parse(e.target.value);
      
      sessionStorage.setItem('postcardType', JSON.stringify(postcardType));
      this.setState({postcardType});
    } else {
      this.setState({postcardType: null});
    }
  }
  
  handleChangeFile(e) {
    this.setState({file: e.target.files[0]});
  }
  
  submit() {
    const postcardModel = {
      categoryId: null,
      vendorCode: null,
      price: null,
      img: null
    };

    postcardModel.categoryId = this.state.postcardType.id;
    postcardModel.vendorCode = this.state.vendorCode;
    postcardModel.price = this.state.price;

    postcardModel.img = this.state.file;

    if (this.state.id) {
      postcardModel.postcardId = this.state.id;
      this.props.onUpdatePostcard(postcardModel);
    } else {
      this.props.onCreatePostcard(postcardModel);
    }
    this.back();
  }

  back() {
    this.props.history.goBack();
  }

  isValidForm() {
    return (
      // this.state.vendorCode.length > 0 &&
      this.state.price &&
      !isNaN(this.state.price) &&
      this.state.postcardType
    );
  }

  getPostcardTypeId() {
    return this.state.postcardType? this.state.postcardType : null
  }

  render() {
    const postcardToUpdateId = this.state.postcardToUpdateId;

    const confirmButton = (postcardToUpdateId)
      ? <Button color='primary' className='mr-2' onClick={this.submit} disabled={!this.isValidForm()}>Изменить</Button>
      : <Button color='primary' className='mr-2' onClick={this.submit} disabled={!this.isValidForm()}>Добавить</Button>

    return (
      <Form className='add-item-form mb-5'>
        <FormGroup>
          <Label for="vendorCode">Артикул</Label>
          <Input type="text" name="vendorCode" id="vendorCode" placeholder="Введите артикул" value={this.state.vendorCode} onChange={this.handleChangeVendorCode} />
        </FormGroup>
        <FormGroup>
          <Label for="privce">Цена</Label>
          <Input type="text" name="privce" id="privce" placeholder="Введите цену" value={this.state.price} onChange={this.handleChangePrice} />
        </FormGroup>
        <FormGroup>
          <Label for="type">Тип</Label>
          <Input type="select" id="type" value={JSON.stringify(this.state.postcardType)} onChange={this.handleChangeCardtype}>
          <option>{EMPTY}</option>
            {this.props.postcardTypes.map(type =>
              (<option key={type.id} value={JSON.stringify(type)}>{type.type}</option>)
            )}
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="exampleFile">File</Label>
          <Input type="file" name="file"   id="exampleFile" onChange={this.handleChangeFile} />
          <FormText color="muted">
            Выберите картинку для открытки
          </FormText>
        </FormGroup>
        {confirmButton}
        <Button onClick={this.back}>Отменить</Button>
      </Form>
    );
  }
}

export default connect(
  state => ({
    postcardToUpdate: state.postcards.postcardToUpdate.postcard[0],
    postcardTypes: state.postcards.postcardTypes
  }),
  dispatch => ({
    onGetPostcardDetail: (id) => {
      dispatch(getPostcardDetails(id));
    },
    onCreatePostcard: (postcard) => {
      dispatch(createPostcard(postcard));
    },
    onUpdatePostcard: (postcard) => {
      dispatch(updatePostcard(postcard));
    },
    onGetPostcardTypes: () => {
      dispatch(getPostcardTypes());
    },
    onClearPostcardToUpdate: () => {
      dispatch(clearPostcardToDelete());
    }
  })
)(PostcardForm);