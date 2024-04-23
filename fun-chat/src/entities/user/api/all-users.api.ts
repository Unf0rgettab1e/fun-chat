import { store } from '@app/providers/store';
import { AllUsersMessageType, AllUsersRequest, User, UserMessageType } from '@shared/api';

export const getActiveUsers = () => {
  const userReq: AllUsersRequest = {
    id: crypto.randomUUID(),
    type: AllUsersMessageType.USER_ACTIVE,
    payload: null,
  };
  store.getState().socket.sendMessage(userReq);
};

export const setActiveUsers = (callback: (users: User[]) => void) => {
  store.getState().socket.on(AllUsersMessageType.USER_ACTIVE, (message) => {
    callback(message.payload.users);
  });
};

export const getInactiveUsers = () => {
  const userReq: AllUsersRequest = {
    id: crypto.randomUUID(),
    type: AllUsersMessageType.USER_INACTIVE,
    payload: null,
  };
  store.getState().socket.sendMessage(userReq);
};

export const setInactiveUsers = (callback: (users: User[]) => void) => {
  store.getState().socket.on(AllUsersMessageType.USER_INACTIVE, (message) => {
    callback(message.payload.users);
  });
};

export const onUsersLogin = (callback: (user: User) => void) => {
  store.getState().socket.on(UserMessageType.EXTERNAL_LOGIN, (message) => {
    callback(message.payload.user);
  });
};

export const onUsersLogout = (callback: (user: User) => void) => {
  store.getState().socket.on(UserMessageType.EXTERNAL_LOGOUT, (message) => {
    callback(message.payload.user);
  });
};
