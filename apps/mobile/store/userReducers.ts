import { LOGIN, LOGOUT } from './reduxTypes';

// 1. Define the shape of your state
interface UserState {
    isSignedIn: boolean;
    userName: string;
}

const initialData: UserState = {
    isSignedIn: false,
    userName: '',
};

// 2. Define the shape of your action
interface UserAction {
    type: string;
    payload: UserState;
}

// 3. Apply the types to the reducer arguments
export default (state = initialData, { type, payload }: UserAction): UserState => {
    switch (type) {
        case LOGIN:
        case LOGOUT: // You can stack these if they do the exact same thing!
            return { isSignedIn: payload.isSignedIn, userName: payload.userName };
        default:
            return state;
    }
};
