import ACTION_TYPES from '../actions/action-types';

const initialState = {
	clients:[],
	clientToUpdate: {
		id: '',
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		phone: '',
		address: '',
		activeStatus: '',
		rate: ''
	}
}

export default function data(state = initialState, action) {
	switch (action.type) {
		case (ACTION_TYPES.SET_CLIENTS_LIST):
			return {
				...state,
				clients: action.clients
			}
		case (ACTION_TYPES.SET_CLIENT_DETAILS):
			return {
				...state,
				clientToUpdate: action.clientDetails
			}

		default:
			return state;
	}
}