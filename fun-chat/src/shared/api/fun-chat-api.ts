import { EventEmitter, EventRecord } from '@shared/event-emitter';

export type MessageResponse = {
  id: string | null;
  type: string;
  payload: object;
};

interface ChatClientEvents extends EventRecord {
  open: null;
  message: MessageResponse;
  close: null;

  error: Event;
}

class ChatClient extends EventEmitter<ChatClientEvents> {
  private socket: WebSocket;

  constructor(url: string) {
    super();
    this.socket = new WebSocket(url);

    this.socket.addEventListener('open', () => {
      this.emit('open', null);
      this.socket.addEventListener('message', (event) => {
        const message: MessageResponse = JSON.parse(event.data);
        this.emit('message', message);
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
