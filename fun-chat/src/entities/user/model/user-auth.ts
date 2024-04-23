import { store } from '@app/providers/store';
import {
  onOpenAuthHandler,
  receiveLoginUser,
  receiveLogoutUser,
  loginUserOnServer,
  logoutUserOnServer,
} from '../api/user-auth.api';
import { UserState } from './types/user';

export const initialUserState: UserState = {
  isLoggedIn: false,
  username: '',
  password: '',
};

const storeUserData = (userData: { username: string; password: string }) => {
  sessionStorage.setItem('userData', JSON.stringify(userData));
};

export const getStoredUserData = () => {
  const userData = sessionStorage.getItem('userData');
  if (userData) {
    const { username, password } = JSON.parse(userData);
    store.setState({ user: { isLoggedIn: true, username, password } });
    onOpenAuthHandler(() => loginUserOnServer({ username, password }));

    return store.getState().user;
  }

  return null;
};

export const removeStoredUserData = () => {
  sessionStorage.removeItem('userData');
};

export const authLogin = (username: string, password: string, callback?: () => void) => {
  loginUserOnServer({ username, password });
  receiveLoginUser(() => {
    storeUserData({ username, password });
    store.setState({ user: { isLoggedIn: true, username, password } });
    if (callback) {
      callback();
    }
  });
};

export const authLogout = (callback?: () => void) => {
  logoutUserOnServer();
  receiveLogoutUser(() => {
    removeStoredUserData();
    store.setState({ user: initialUserState });
    if (callback) {
      callback();
    }
  });
};

export const isAuth = () => getStoredUserData() !== null;

export const getUser = () => store.getState().user;
