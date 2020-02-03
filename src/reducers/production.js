import ACTION_TYPES from '../actions/action-types';

const initialState = {
	productionPageData: {
		postcards: [],
		users: [],
		postcardTypes: []
	}
}

export default function data(state = initialState, action) {
	switch (action.type) {
		case (ACTION_TYPES.SET_PRODCTION_DATA):
			return {
				...state,
				productionPageData: action.data
			}
		default:
			return state;
	}
}