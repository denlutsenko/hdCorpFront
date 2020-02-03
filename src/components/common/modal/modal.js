import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';
import { connect } from 'react-redux';
import { hideModal } from '../../../actions/data';

class ModalWindow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: true
    };
  }

  render() {
    return (
      <div>
        <Modal isOpen={this.props.active}>
          <ModalBody>
            {this.props.text}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" size='sm' onClick={this.props.onHideModalWindow}>OK</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default connect(null,
  (dispatch) => ({
    onHideModalWindow: () => {
      dispatch(hideModal());
    }
  })
)(ModalWindow);