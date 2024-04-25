import { store } from '@app/providers/store';
import { UserRequest } from '@shared/api/types/requests';
import { ErrorType, UserErrors, UserMessageType } from '@shared/api';
import Modal from '@shared/ui/modal/modal';
import { error } from '../ui/auth-error/auth-error';

export const onOpenAuthHandler = (callback: () => void) => {
  store.getState().socket.on('open', () => {
    callback();
  });
};

export const receiveLoginUser = (callback: () => void) => {
  store.getState().socket.on(UserMessageType.LOGIN, () => {
    callback();
  });
};

export const receiveLogoutUser = (callback: () => void) => {
  store.getState().socket.on(UserMessageType.LOGOUT, () => {
    callback();
  });
};

export const receiveUserError = () => {
  store.getState().socket.on(ErrorType.ERROR, (message) => {
    switch (message.payload.error) {
      case UserErrors.USER_ALREADY_LOGGED:
        new Modal().open(error('Oops, error...', 'User with this login is already authorized!'));
        break;
      case UserErrors.INCORRECT_PASSWORD:
        new Modal().open(error('Oops, error...', 'Incorrect password!'));
        break;
      default:
        break;
    }
  });
};

export const loginUserOnServer = ({ username, password }: { username: string; password: string }) => {
  const userReq: UserRequest = {
    id: crypto.randomUUID(),
    type: UserMessageType.LOGIN,
    payload: {
      user: {
        login: username,
        password,
      },
    },
  };
  receiveUserError();
  store.getState().socket.sendMessage(userReq);
};

export const logoutUserOnServer = () => {
  const userReq: UserRequest = {
    id: crypto.randomUUID(),
    type: UserMessageType.LOGOUT,
    payload: {
      user: {
        login: store.getState().user.username,
        password: store.getState().user.password,
      },
    },
  };
  receiveUserError();
  store.getState().socket.sendMessage(userReq);
};
