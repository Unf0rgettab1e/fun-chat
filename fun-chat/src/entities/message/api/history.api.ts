import { store } from '@app/providers/store';
import { ChatingMessageType, Message, MsgHistoryRequest } from '@shared/api';

export const getHistory = (username: string) => {
  const historyReq: MsgHistoryRequest = {
    id: crypto.randomUUID(),
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
    callback(message.payload.messages);
  });
};
