import ACTION_TYPES from '../actions/action-types';

const initialState = {
	salesPageData: {
		postcards: [],
		clients: []
	}
}

export default function data(state = initialState, action) {
	switch (action.type) {
		case (ACTION_TYPES.SET_SALES_DATA):
			return {
				...state,
				salesPageData: action.data
			}
		default:
			return state;
	}
}