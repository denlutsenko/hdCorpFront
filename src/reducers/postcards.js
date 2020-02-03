import ACTION_TYPES from '../actions/action-types';

const initialState = {
	postcards: [],
	postcardToUpdate: {
		postcard: [{
			postcardType: null
		}],
		postcardTypes: []
	},
	postcardTypes: []
}

export default function data(state = initialState, action) {
	switch (action.type) {
		case (ACTION_TYPES.SET_POSTCARD_LIST):
			return {
				...state,
				postcards: action.postcards
			}
		case (ACTION_TYPES.SET_POSTCARD_TO_UPDATE):
			return {
				...state,
				postcardToUpdate: action.postcardToUpdate
			}
		case (ACTION_TYPES.CLEAR_POSTCARD_TO_UPDATE):
			return {
				...state,
				postcardToUpdate: {
					postcard: [{}],
					postcardTypes: []
				}
			}
		case (ACTION_TYPES.SET_POSTCARD_TYPES):
			return {
				...state,
				postcardTypes: action.postcardTypes
			}

		default:
			return state;
	}
}