import axios from 'axios';

import { ajaxRequestStart, ajaxRequestEnd } from './app';
import urls from '../config/urls';
import ACTION_TYPES from './action-types';

// BALANCE PAGE
export const getBalanceData = (month) => (dispatch) => {
  const params = month ? `?date=${month}` : '' ;

  dispatch(ajaxRequestStart());
  axios.get(`${urls.balance}/${params}`)
    .then(({ data }) => dispatch({
      type: ACTION_TYPES.SET_BALANCE_DATA,
      data
    }))
    .then(() => dispatch(ajaxRequestEnd()));
};

// PRODUCTION PAGE
export const getCardListForProduction = () => (dispatch) => {
  dispatch(ajaxRequestStart());
  axios.get(`${urls.production}`)
    .then(({ data }) => dispatch({
      type: ACTION_TYPES.SET_PRODCTION_DATA,
      data
    }))
    .then(() => dispatch(ajaxRequestEnd()));
};

export const postProducedPostcards = (data) => (dispatch) => {
  dispatch(ajaxRequestStart());
  axios.post(`${urls.addPostcards}`, data)
    .then(() => dispatch(ajaxRequestEnd()))
    .then(() => dispatch(savedSuccessfully()), (e) => dispatch(errorMessage(e)))
    .then(() => dispatch(getCardListForProduction()));
};

// SALES PAGE
export const getCardListForSale = () => (dispatch) => {
  dispatch(ajaxRequestStart());
  axios.get(`${urls.orders}`)
    .then(({ data }) => dispatch({
      type: ACTION_TYPES.SET_SALES_DATA,
      data
    }))
    .then(() => dispatch(ajaxRequestEnd()));
};

export const sendSoldPostcards = (data) => (dispatch) => {
  dispatch(ajaxRequestStart());
  axios.post(`${urls.addOrder}`, data)
    .then(() => dispatch(ajaxRequestEnd()))
    .then(() => dispatch(getCardListForSale()))
    .then(() => dispatch(savedSuccessfully()));
};

// ADMINISTRATION - USERS
export const getUserList = () => (dispatch) => {
  dispatch(ajaxRequestStart());
  axios.get(`${urls.userList}`)
    .then(({ data }) => dispatch({
      type: ACTION_TYPES.SET_USER_LIST,
      data
    }))
    .then(() => dispatch(ajaxRequestEnd()));
};

export const getRoles = () => (dispatch) => {
  dispatch(ajaxRequestStart());
  axios.get(`${urls.roles}`)
    .then(({ data }) => dispatch({
      type: ACTION_TYPES.SET_ROLES_LIST,
      roles: data
    }))
    .then(() => dispatch(ajaxRequestEnd()));
};

export const sendNewUser = (data) => (dispatch) => {
  dispatch(ajaxRequestStart());
  axios.post(`${urls.newUser}`, data)
    .then(() => dispatch(ajaxRequestEnd()))
    .then(() => dispatch(getUserList()))
    .then(() => dispatch(savedSuccessfully()), () => dispatch(showModal('Не удалось')));
};

export const updateUser = (user) => (dispatch) => {
  dispatch(ajaxRequestStart());
  axios.post(`${urls.updateUser}`, user)
    .then(() => dispatch(savedSuccessfully()), () => dispatch(showModal('Не удалось')))
    .then(() => dispatch(getUserList()))
    .then(() => dispatch(ajaxRequestEnd()));
};

export const deleteUser = (userId) => (dispatch) => {
  const data = { userId };

  dispatch(ajaxRequestStart());
  axios.delete(`${urls.deleteUser}/${userId}`, data)
    .then(() => dispatch(deletedSuccessfully()), (e) => dispatch(errorMessage(e)))
    .then(() => dispatch(ajaxRequestEnd()))
    .then(() => dispatch(getUserList()));
}

export const getUserDetails = (userId = null) => (dispatch) => {
  dispatch(ajaxRequestStart());
  axios.get(`${urls.userDetails}${userId}`)
    .then(({ data }) => dispatch({
      type: ACTION_TYPES.SET_USER_TO_UPDATE,
      userToUpdate: data
    }))
    .then(() => dispatch(ajaxRequestEnd()));
}

export const clearUserToUpdate = () => (dispatch) => {
  dispatch({
    type: ACTION_TYPES.CLEAR_USER_TO_UPDATE
  });
}

// ADMINISTRATION - CLIENTS

export const getClients = () => (dispatch) => {
  dispatch(ajaxRequestStart());
  axios.get(`${urls.clients}`)
    .then(({ data }) => dispatch({
      type: ACTION_TYPES.SET_CLIENTS_LIST,
      clients: data
    }))
    .then(() => dispatch(ajaxRequestEnd()));
}

export const getClientDeltails = (id) => (dispatch) => {
  dispatch(ajaxRequestStart());
  axios.get(`${urls.clientDetails}${id}`)
    .then(({ data }) => dispatch({
      type: ACTION_TYPES.SET_CLIENT_DETAILS,
      clientDetails: data
    }))
    .then(() => dispatch(ajaxRequestEnd()));
}

export const createClient = (client) => (dispatch) => {
  dispatch(ajaxRequestStart());
  axios.post(`${urls.saveClient}`, client)
    .then(() => dispatch(savedSuccessfully()))
    .then(() => dispatch(ajaxRequestEnd()))
    .then(() => dispatch(getClients()));
};

export const deleteClient = (id) => (dispatch) => {
  dispatch(ajaxRequestStart());
  axios.get(`${urls.deleteClient}${id}`)
    .then(() => dispatch(deletedSuccessfully()))
    .then(() => dispatch(ajaxRequestEnd()))
    .then(() => dispatch(getClients()));
};

// ADMINISTRATION - POSTCARDS

export const getPostcards = () => (dispatch) => {
  dispatch(ajaxRequestStart());
  axios.get(`${urls.postcards}`)
    .then(({ data }) => dispatch({
      type: ACTION_TYPES.SET_POSTCARD_LIST,
      postcards: data
    }))
    .then(() => dispatch(ajaxRequestEnd()));
}

export const getPostcardDetails = (id) => (dispatch) => {
  dispatch(ajaxRequestStart());
  axios.get(`${urls.postcardDetails}${id}`)
    .then(({ data }) =>{
      dispatch({
        type: ACTION_TYPES.SET_POSTCARD_TO_UPDATE,
        postcardToUpdate: data
      })
    }
      )
    .then(() => dispatch(ajaxRequestEnd()));
}

export const clearPostcardToDelete = () => (dispatch) => {
  dispatch({
    type: ACTION_TYPES.CLEAR_POSTCARD_TO_UPDATE
  });
}

export const getPostcardTypes = () => (dispatch) => {
  dispatch(ajaxRequestStart());
  axios.get(`${urls.postcardTypes}`)
    .then(({ data }) => dispatch({
      type: ACTION_TYPES.SET_POSTCARD_TYPES,
      postcardTypes: data
    }))
    .then(() => dispatch(ajaxRequestEnd()));
}

export const createPostcard = ({
  categoryId,
  vendorCode,
  price,
  img
}) => (dispatch) => {
  const formData = new FormData();

  formData.append('categoryId', categoryId);
  formData.append('vendorCode', vendorCode);
  formData.append('price', price);
  formData.append('img', img);

  dispatch(ajaxRequestStart());
  axios.post(`${urls.savePostcard}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(() => dispatch(savedSuccessfully()))
    .then(() => dispatch(ajaxRequestEnd()))
    .then(() => dispatch(getPostcards()));
}

export const updatePostcard = ({
  postcardId,
  categoryId,
  vendorCode,
  price,
  img
}) => (dispatch) => {
  const formData = new FormData();

  formData.append('postcardId', postcardId);
  formData.append('categoryId', +categoryId);
  formData.append('vendorCode', vendorCode);
  formData.append('price', +price);
  formData.append('img', img);

  dispatch(ajaxRequestStart());
  axios.post(`${urls.updatePostcard}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(() => dispatch(savedSuccessfully()))
    .then(() => dispatch(getPostcards()))
    .then(() => dispatch(ajaxRequestEnd()));
}

export const deletePostcard = (id) => (dispatch) => {
  dispatch(ajaxRequestStart());
  axios.delete(`${urls.deletePostcard}${id}`)
    .then(() => dispatch(deletedSuccessfully()))
    .then(() => dispatch(ajaxRequestEnd()))
    .then(() => dispatch(getPostcards()));
}

//  APP STATE
export const savedSuccessfully = () => (dispatch) => {
  dispatch({
    type: ACTION_TYPES.APP_STATE_SHOW_MODAL,
    text: 'Сохранено'
  });
};

export const updatedSuccessfully = () => (dispatch) => {
  dispatch({
    type: ACTION_TYPES.APP_STATE_SHOW_MODAL,
    text: 'Обновлено'
  });
};

export const deletedSuccessfully = () => (dispatch) => {
  dispatch({
    type: ACTION_TYPES.APP_STATE_SHOW_MODAL,
    text: 'Удалено'
  });
};

export const errorMessage = (e) => (dispatch) => {
  dispatch({
    type: ACTION_TYPES.APP_STATE_SHOW_MODAL,
    text: 'Не удалось'
  });
};

export const showModal = (text) => (dispatch) => {
  dispatch({
    type: ACTION_TYPES.APP_STATE_SHOW_MODAL,
    text
  });
};

export const hideModal = (text) => (dispatch) => {
  dispatch({
    type: ACTION_TYPES.APP_STATE_HIDE_MODAL
  });
};
