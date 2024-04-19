import { store } from '@app/providers/store';
import modal from '@shared/ui/modal/modal';
import { UserMessageTypes } from './const/user-const';
import { UserResponse } from './types/user';
import { error } from '../ui/auth-error/user-error';

export const onOpenAuthHandler = (callback: () => void) => {
  store.getState().socket.on('open', () => {
    callback();
  });
};

export const sendUserData = ({ username, password }: { username: string; password: string }) => {
  const userReq = {
    id: crypto.randomUUID(),
    type: UserMessageTypes.LOGIN,
    payload: {
      user: {
        login: username,
        password,
      },
    },
  };
  store.getState().socket.sendMessage(userReq);
};

export const receiveUserData = (callback: () => void) => {
  store.getState().socket.on('message', (message: UserResponse) => {
    switch (message.type) {
      case UserMessageTypes.LOGIN:
        callback();
        break;
      case UserMessageTypes.ERROR:
        modal.open(error(message.payload.error ?? ''));
        break;
      default:
        break;
    }
  });
};
