import ACTION_TYPES from './action-types';

export const ajaxRequestStart = () => ({
  type: ACTION_TYPES.APP_STATE_AJAX_REQUEST_START,
});

export const ajaxRequestEnd = () => ({
  type: ACTION_TYPES.APP_STATE_AJAX_REQUEST_END,
});
