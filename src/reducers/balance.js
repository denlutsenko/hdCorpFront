import ACTION_TYPES from '../actions/action-types';

const initialState = {
	balancePageData: {
		accounting: [],
		postcardTypes: [],
		months: []
	}
}

export default function data(state = initialState, action) {
	switch (action.type) {
		case (ACTION_TYPES.SET_BALANCE_DATA):
			return {
				...state,
				balancePageData: action.data
			}
		default:
			return state;
	}
}