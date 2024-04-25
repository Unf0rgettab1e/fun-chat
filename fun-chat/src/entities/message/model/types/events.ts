import ChatMessage from '@entities/message/ui/message';

export interface EditMsgEvent {
  message: ChatMessage;
}

export interface UpdateUnreadEvent {
  count: number;
  username: string;
}

export interface DeleteMsgEvent {
  msgId: string;
}
