import { EventEmitter, EventRecord } from '@shared/event-emitter';
import {
  AllUsersResponse,
  ErrorResponse,
  MessageResponse,
  MsgDeleteResponse,
  MsgDeliveredResponse,
  MsgEditResponse,
  MsgHistoryResponse,
  MsgReadResponse,
  MsgSendingResponse,
  UserResponse,
} from './types/responses';
import {
  AllUsersMessageType,
  ChatingMessageType,
  ErrorType,
  StatusMessageType,
  UserMessageType,
} from './const/message-types';

type UserEvents = {
  [key in UserMessageType]: UserResponse;
};

type AllUsersEvents = {
  [key in AllUsersMessageType]: AllUsersResponse;
};

type MsgSendEvent = {
  [ChatingMessageType.MSG_SEND]: MsgSendingResponse;
};
type MsgHistoryEvent = {
  [ChatingMessageType.MSG_FROM_USER]: MsgHistoryResponse;
};

type MsgDelivered = {
  [StatusMessageType.MSG_DELIVER]: MsgDeliveredResponse;
};

type MsgReaded = {
  [StatusMessageType.MSG_READ]: MsgReadResponse;
};

type MsgEdited = {
  [StatusMessageType.MSG_EDIT]: MsgEditResponse;
};

type MsgDeleted = {
  [StatusMessageType.MSG_DELETE]: MsgDeleteResponse;
};

type ErrorEvent = {
  [key in ErrorType]: ErrorResponse;
};

type ChatClientEvents = EventRecord &
  UserEvents &
  AllUsersEvents &
  MsgSendEvent &
  MsgHistoryEvent &
  MsgDelivered &
  MsgReaded &
  MsgEdited &
  MsgDeleted &
  ErrorEvent & {
    open: null;
    close: null;
    error: Event;
  };

class ChatClient extends EventEmitter<ChatClientEvents> {
  private socket: WebSocket;

  constructor(url: string) {
    super();
    this.socket = new WebSocket(url);

    this.socket.addEventListener('open', () => {
      this.emit('open', null);
      this.socket.addEventListener('message', (event) => {
        const message: MessageResponse = JSON.parse(event.data);
        this.emit(message.type, message);
      });
    });

    this.socket.addEventListener('close', () => {
      this.emit('close', null);
    });

    this.socket.addEventListener('error', (error) => {
      this.emit('error', error);
    });
  }

  sendMessage(message: object) {
    this.socket.send(JSON.stringify(message));
  }

  closeConnection() {
    this.socket.close();
  }
}

export default ChatClient;
