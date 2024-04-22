import { AllUsersMessageType, ChatingMessageType, StatusMessageType, UserMessageType } from '../const/message-types';

export interface GeneralRequest {
  id: string;
  type: string;
  payload: object | null;
}

export interface UserPayload {
  login: string;
  password: string;
}

export interface UserRequest extends GeneralRequest {
  type: UserMessageType;
  payload: {
    user: UserPayload;
  };
}

export interface AllUsersRequest extends GeneralRequest {
  type: AllUsersMessageType;
  payload: null;
}

export interface MsgSendingRequest extends GeneralRequest {
  type: ChatingMessageType.MSG_SEND;
  payload: {
    message: {
      to: string;
      text: string;
    };
  };
}

export interface MsgHistoryRequest extends GeneralRequest {
  type: ChatingMessageType.MSG_FROM_USER;
  payload: {
    user: {
      login: string;
    };
  };
}

export interface MsgActionRequest extends GeneralRequest {
  type: Exclude<StatusMessageType, StatusMessageType.MSG_DELIVER>;
  payload: {
    message: {
      id: string;
    };
  };
}

export interface MsgEditRequest extends MsgActionRequest {
  type: StatusMessageType.MSG_EDIT;
  payload: MsgActionRequest['payload'] & {
    message: {
      text: string;
    };
  };
}
