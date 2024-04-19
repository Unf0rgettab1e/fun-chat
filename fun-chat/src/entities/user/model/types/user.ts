import { MessageResponse } from '@shared/api/fun-chat-api';
import { UserMessageTypes } from '../const/user-const';

export interface UserState {
  isLoggedIn: boolean;
  username: string;
  password: string;
}

export interface UserRequest {
  id: string;
  type: UserMessageTypes;
  payload: {
    user: {
      login: string;
      password: string;
    };
  };
}

export interface UserResponse extends MessageResponse {
  id: string | null;
  type: UserMessageTypes | string;
  payload: {
    user?: {
      login: string;
      isLogined: boolean;
    };
    error?: string;
  };
}
