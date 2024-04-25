import { store } from '@app/providers/store';
import { ChatingMessageType, Message, MsgHistoryRequest } from '@shared/api';
import { HistoryWithPrefix } from '../model/const';

export const getHistory = (username: string, isCurrent = false) => {
  const historyReq: MsgHistoryRequest = {
    id: crypto.randomUUID() + HistoryWithPrefix + (isCurrent ? '' : username),
    type: ChatingMessageType.MSG_FROM_USER,
    payload: {
      user: {
        login: username,
      },
    },
  };
  store.getState().socket.sendMessage(historyReq);
};

export const onMsgHistory = (callback: (messages: Message[]) => void) => {
  store.getState().socket.on(ChatingMessageType.MSG_FROM_USER, (message) => {
    if (message.id?.split(HistoryWithPrefix)[1] === '') {
      callback(message.payload.messages);
    }
  });
};

export const onMsgHistoryByUser = (callback: (messages: Message[]) => void, username: string) => {
  store.getState().socket.on(ChatingMessageType.MSG_FROM_USER, (message) => {
    if (message.id?.split(HistoryWithPrefix)[1] === username) {
      callback(message.payload.messages);
    }
  });
};
