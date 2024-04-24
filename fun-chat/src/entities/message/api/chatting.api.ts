import {
  ChatingMessageType,
  Message,
  MsgActionRequest,
  MsgSendingRequest,
  MsgSendingResponse,
  StatusMessageType,
} from '@shared/api';
import { store } from '@app/providers/store';
import { getUser } from '@entities/user';
import { MessageIdPrefix } from '../const';

export const sendMsg = ({ to, text }: { to: string; text: string }) => {
  const sendReq: MsgSendingRequest = {
    id: MessageIdPrefix + getUser().username,
    type: ChatingMessageType.MSG_SEND,
    payload: {
      message: {
        to,
        text,
      },
    },
  };
  store.getState().socket.sendMessage(sendReq);
};

export const readMsg = (id: string) => {
  const sendReq: MsgActionRequest = {
    id: crypto.randomUUID(),
    type: StatusMessageType.MSG_READ,
    payload: {
      message: {
        id,
      },
    },
  };
  store.getState().socket.sendMessage(sendReq);
};

const msgSendListener = (callback: (message: Message) => void, username: string = getUser().username) =>
  function onMsgSend(message: MsgSendingResponse) {
    if (message.payload.message.from === username) {
      callback(message.payload.message);
    }
  };

export const onSendMsgByUser = (callback: (message: Message) => void, username: string = getUser().username) => {
  const fn = msgSendListener(callback, username);
  store.getState().socket.on(ChatingMessageType.MSG_SEND, fn);
  return fn;
};

export const onMsgDelivered = (callback: () => void, msgID: string) => {
  store.getState().socket.on(StatusMessageType.MSG_DELIVER, (message) => {
    if (message.payload.message.id === msgID && message.payload.message.status.isDelivered) {
      callback();
    }
  });
};

export const onMsgReaded = (callback: () => void, msgID: string) => {
  store.getState().socket.on(StatusMessageType.MSG_READ, (message) => {
    if (message.payload.message.id === msgID && message.payload.message.status.isReaded) {
      callback();
    }
  });
};

export const onMsgEdited = (callback: () => void, msgID: string) => {
  store.getState().socket.on(StatusMessageType.MSG_EDIT, (message) => {
    if (message.payload.message.id === msgID && message.payload.message.status.isEdited) {
      callback();
    }
  });
};

export const onMsgDeleted = (callback: () => void, msgID: string) => {
  store.getState().socket.on(StatusMessageType.MSG_DELETE, (message) => {
    if (message.payload.message.id === msgID && message.payload.message.status.isDeleted) {
      callback();
    }
  });
};

export const offSendMsgByUser = (fn: (data: MsgSendingResponse) => void) => {
  store.getState().socket.off(ChatingMessageType.MSG_SEND, fn);
};
