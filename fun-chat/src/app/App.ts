import { Component } from '@shared/component';
import { ChatClient } from '@shared/api';
import { DeleteMsgEvent, EditMsgEvent, UpdateUnreadEvent } from '@entities/message';
import { div } from '@shared/tags';
import Loader from '@shared/ui/loader/loader';
import Modal from '@shared/ui/modal/modal';
import { AppRoutes, Router, getRouter } from './router';
import { getAboutRoute } from './router/const';
import { LOCAL_URL, store } from './providers/store';
import { SelectUserEvent, error, getStoredUserData } from '@/entities/user';

interface ReconnectEvent {}

declare global {
  interface Document {
    dispatchEvent(event: CustomEvent<SelectUserEvent>): boolean;
    dispatchEvent(event: CustomEvent<EditMsgEvent>): boolean;
    dispatchEvent(event: CustomEvent<UpdateUnreadEvent>): boolean;
    dispatchEvent(event: CustomEvent<ReconnectEvent>): boolean;
    dispatchEvent(event: CustomEvent<DeleteMsgEvent>): boolean;
    addEventListener(
      type: 'selectUser',
      listener: (event: CustomEvent<SelectUserEvent>) => void,
      options?: boolean | AddEventListenerOptions
    ): void;
    addEventListener(
      type: 'editMessage',
      listener: (event: CustomEvent<EditMsgEvent>) => void,
      options?: boolean | AddEventListenerOptions
    ): void;
    addEventListener(
      type: 'updateUnread',
      listener: (event: CustomEvent<UpdateUnreadEvent>) => void,
      options?: boolean | AddEventListenerOptions
    ): void;
    addEventListener(
      type: 'messageDeleted',
      listener: (event: CustomEvent<DeleteMsgEvent>) => void,
      options?: boolean | AddEventListenerOptions
    ): void;
    addEventListener(
      type: 'reconnect',
      listener: (event: CustomEvent<ReconnectEvent>) => void,
      options?: boolean | AddEventListenerOptions
    ): void;
  }
}

class App extends Component {
  private router: Router = getRouter();

  constructor() {
    super({ className: 'app' });

    this.render();
  }

  setPage(page: Component) {
    this.destroyChildren();
    this.appendChild(page);
  }

  render() {
    this.destroyChildren();
    document.addEventListener('DOMContentLoaded', () => this.selectPathHandler());
    // document.addEventListener('reconnect', () => this.selectPathHandler());

    document.body.append(this.node);

    store.getState().socket.on('close', () => {
      const modal = new Modal(false);
      modal.open(
        div({ className: 'reconnect' }, error('Server is not available!', 'Try reconnecting...'), new Loader())
      );
      function reconnect() {
        store.getState().socket = new ChatClient(LOCAL_URL);

        store.getState().socket.on('open', () => {
          modal.close();
          // const prefApp = app;
          // app = new App();
          // app.selectPathHandler();
          // prefApp.destroy();
          window.location.reload();

          // const event = new CustomEvent<ReconnectEvent>('reconnect');
          // document.dispatchEvent(event);
          // // const app = new App();
          // // getApp();
        });

        store.getState().socket.on('close', () => {
          setTimeout(reconnect, 2000);
        });
      }

      reconnect();
    });
  }

  selectPathHandler() {
    if (!getStoredUserData() && window.location.pathname !== getAboutRoute()) {
      this.router.navigate(AppRoutes.LOGIN);
      return;
    }
    this.router.validateCurrentPath();
  }
}

const app = new App();

const getApp = () => app;

export default getApp();
