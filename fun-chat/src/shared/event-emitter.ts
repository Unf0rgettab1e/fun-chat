export type Listener<T> = (data: T) => void;
export type EventRecord = Record<string, unknown>;
export type EventMap<Events extends EventRecord> = {
  [e in keyof Events]?: Listener<Events[e]>[];
};

export class EventEmitter<Events extends EventRecord> {
  private listeners: EventMap<Events> = {};

  on<Event extends keyof Events>(event: Event, listener: Listener<Events[Event]>): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]?.push(listener);
  }

  off<Event extends keyof Events>(event: Event, listener: Listener<Events[Event]>): void {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event] = this.listeners[event]?.filter((l) => l !== listener);
  }

  emit<Event extends keyof Events>(event: Event, data: Events[Event]): void {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event]?.forEach((listener) => listener(data));
  }
}
