import ACTION_TYPES from '../actions/action-types';

const hiddentModalWindow = {
  isModalActive: false,
  text: ''
};

const initState = {
  isAppLoaded: true,
  modal: hiddentModalWindow
};

export default function data(state = initState, action) {
  switch (action.type) {
    case ACTION_TYPES.APP_STATE_AJAX_REQUEST_START:
      return {
        ...state,
        isAppLoaded: false
      }
    case ACTION_TYPES.APP_STATE_AJAX_REQUEST_END:
      return {
        ...state,
        isAppLoaded: true
      }
    case ACTION_TYPES.APP_STATE_SHOW_MODAL:
      return {
        ...state,
        modal: {
          isModalActive: true,
          text: action.text
        }
      }
    case ACTION_TYPES.APP_STATE_HIDE_MODAL:
      return {
        ...state,
        modal: hiddentModalWindow
      }

    default:
      return state;
  }
}