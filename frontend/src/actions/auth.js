import { useQuery } from '@apollo/client';
import { GET_USER_INFO } from '../queries';
import { AUTH_ERROR, LOGIN, LOGOUT, USER_LOADED, USER_LOADING } from '../types';

export const loadUser = (dispatch, state) => {
	dispatch({ type: USER_LOADING, payload: {} });
};

export const loginUser = (dispatch) => {
	dispatch({ type: LOGIN, payload: {} });
};

export const logoutUser = (dispatch) => {
	dispatch({ type: LOGOUT, payload: {} });
};
