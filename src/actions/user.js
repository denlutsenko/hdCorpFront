import axios from 'axios';

import urls from '../config/urls';
import ACTION_TYPES from './action-types';

export const logout = () => dispatch => {
  localStorage.removeItem('user');
  dispatch({
    type: 'CLEAR_USER'
  });
}

export const loginUser = credentials => dispatch => {
  return axios.post(`${urls.login}`, credentials)
    .then(({ data }) => {
        localStorage.setItem('user', JSON.stringify(data));
        dispatch({
          type: 'SET_USER',
          user: data
        });
    },
    err => {
      dispatch({
        type: ACTION_TYPES.APP_STATE_SHOW_MODAL,
        text: 'Введен неверный логин или пароль'
      })
    });
};