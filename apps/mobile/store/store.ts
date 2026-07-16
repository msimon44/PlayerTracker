import { combineReducers, createStore } from 'redux';
import userReducers from './userReducers';

const rootReducer = combineReducers({
    connectedUserData: userReducers,
});

export const globalStore = createStore(rootReducer);
export type RootState = ReturnType<typeof rootReducer>;
