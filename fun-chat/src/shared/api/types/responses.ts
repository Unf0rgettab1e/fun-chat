import { AllUsersMessageType, ChatingMessageType, StatusMessageType, UserMessageType } from '../const/message-types';

export interface MessageResponse {
  id: string | null;
  type: string;
  payload: object;
}

export type User = {
  login: string;
  isLogined: boolean;
};

export interface UserResponse extends MessageResponse {
  type: UserMessageType;
  payload: {
    user: User;
  };
}

export interface AllUsersResponse extends MessageResponse {
  type: AllUsersMessageType;
  payload: User[];
}

export interface Message {
  id: string;
  from: string;
  to: string;
  text: string;
  datetime: number;
  status: Omit<Status, 'isDeleted'>;
}

export interface MsgSendingResponse extends MessageResponse {
  type: ChatingMessageType.MSG_SEND;
  payload: {
    message: Message;
  };
}

export interface MsgHistoryResponse extends MessageResponse {
  type: ChatingMessageType.MSG_FROM_USER;
  payload: {
    messages: Message[];
  };
}

export interface Status {
  isDelivered: boolean;
  isReaded: boolean;
  isEdited: boolean;
  isDeleted: boolean;
}

export interface MsgDeliveredResponse extends MessageResponse {
  type: StatusMessageType.MSG_DELIVER;
  payload: {
    message: Pick<Message, 'id'> & {
      status: Pick<Status, 'isDelivered'>;
    };
  };
}

export interface MsgReadResponse extends MessageResponse {
  type: StatusMessageType.MSG_READ;
  payload: {
    message: Pick<Message, 'id'> & {
      status: Pick<Status, 'isReaded'>;
    };
  };
}

export interface MsgEditResponse extends MessageResponse {
  type: StatusMessageType.MSG_EDIT;
  payload: {
    message: Pick<Message, 'id'> & {
      status: Pick<Status, 'isEdited'>;
    };
  };
}

export interface MsgDeleteResponse extends MessageResponse {
  type: StatusMessageType.MSG_DELETE;
  payload: {
    message: Pick<Message, 'id'> & {
      status: Pick<Status, 'isDeleted'>;
    };
  };
}

export interface ErrorResponse extends MessageResponse {
  type: 'ERROR';
  payload: {
    error: string;
  };
}
