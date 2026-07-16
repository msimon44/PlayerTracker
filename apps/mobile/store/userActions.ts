import { LOGIN, LOGOUT } from './reduxTypes';

export const loginAction = (newUserName: string) => {
    return {
        type: LOGIN,
        payload: { isSignedIn: true, userName: newUserName },
    };
};

export const logoutAction = () => {
    return {
        type: LOGOUT,
        payload: { isSignedIn: false, userName: '' },
    };
};
