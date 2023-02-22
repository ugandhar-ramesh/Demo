import { User } from "../models/user.model";
import * as AuthActions from './auth.actions';

export interface State {
    user: User | null;
    authError: string;
    loading: boolean;
}

const initialState: State = {
    user: null,
    authError: '',
    loading: false
}

export function authReducer(state: State = initialState, action: AuthActions.AuthActions) {
    switch (action.type){
        case AuthActions.AUTHENTICATE_SUCCESS:
            const user = new User(action.payload.email, action.payload.userId, action.payload.token, action.payload.expirationDate);
            return {
                ...state,
                user: user,
                loading: false
            }
        case AuthActions.LOGIN_START:
        case AuthActions.SIGNUP_START:
            return {
                ...state,
                authError:'',
                loading: true
            }
        case AuthActions.AUTHENTICATE_FAIL:
            return {
                ...state,
                user: null,
                authError: action.payload,
                loading: false
            }
        case AuthActions.CLEAR_ERROR:
            return {
                ...state,
                authError: ''
            }
        case AuthActions.LOGOUT:
            return {
                ...state,
                user: null
            }
        default:
            return state;
    }
}