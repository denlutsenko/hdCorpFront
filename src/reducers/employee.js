import ACTION_TYPES from '../actions/action-types';

const blankUser = {
	id: '',
	firstName: '',
	lastName: '',
	email: '',
	password: '',
	phone: '',
	address: '',
	activeStatus: '',
	rate: '',
	role: null,
};

const initialState = {
	userList: {
		users: []
	},
	roleList: [],
	userToUpdate: blankUser,
	userToDeleteId: null
};

export default function data(state = initialState, action) {
	switch (action.type) {
		case (ACTION_TYPES.SET_USER_LIST):
			return {
				...state,
				userList: action.data
			}
		case (ACTION_TYPES.SET_ROLES_LIST):
			return {
				...state,
				roleList: action.roles
			}
		case (ACTION_TYPES.SET_USER_TO_UPDATE):
			return {
				...state,
				userToUpdate: action.userToUpdate
			}
		case (ACTION_TYPES.CLEAR_USER_TO_UPDATE):
			return {
				...state,
				userToUpdate: blankUser
			}
			
		default:
			return state;
	}
}