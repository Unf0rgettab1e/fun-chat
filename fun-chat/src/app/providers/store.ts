import { EventEmitter, EventRecord } from '@shared/event-emitter';
import ChatClient from '@shared/api/fun-chat-api';
import { UserState, initialUserState } from '@/entities/user';

export const LOCAL_URL = 'ws://localhost:4000 ';
export const PROD_URL = 'wss://fun-chat-server.onrender.com';

interface StoreEvents extends EventRecord {
  stateChange: AppStateSchema;
}

interface AppStateSchema {
  user: UserState;
  socket: ChatClient;
}

class Store extends EventEmitter<StoreEvents> {
  private state: AppStateSchema;

  constructor(initialState: AppStateSchema) {
    super();
    this.state = initialState;
  }

  getState(): AppStateSchema {
    return this.state;
  }

  setState(newState: Partial<AppStateSchema>): void {
    this.state = { ...this.state, ...newState };
    this.emit('stateChange', this.state);
  }
}

const initialState: AppStateSchema = {
  socket: new ChatClient(LOCAL_URL),
  user: initialUserState,
};
export const store = new Store(initialState);
