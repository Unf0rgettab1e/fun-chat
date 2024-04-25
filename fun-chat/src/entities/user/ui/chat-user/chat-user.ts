import { Component } from '@shared/component';
import { div, img, span } from '@shared/tags';
import avatar from '@shared/assets/icons/user-circle.svg';
import { SelectUserEvent } from '@entities/user';
import { UpdateUnreadEvent, getHistory, onMsgHistoryByUser, onSendMsgByUser } from '@entities/message';
import styles from './chat-user.module.css';

export default class ChatUser extends Component<HTMLLIElement> {
  private statusEl = span({ className: styles.chatUserStatus });

  private unread = span({ className: styles.chatUserUnread });

  private unreadCounter = 0;

  private usernameEl = span({ className: styles.chatUserName });

  constructor(
    private username: string,
    private status: boolean
  ) {
    super({ tag: 'li', className: styles.chatUser });
    this.render();
  }

  render() {
    this.destroyChildren();
    this.statusEl.getNode().dataset.status = this.status ? 'online' : 'offline';
    this.usernameEl.setText(this.username);
    this.appendChildren([
      div(
        { className: styles.chatUserInfo },
        img({ className: styles.chatUserAvatar, src: avatar }),
        this.usernameEl,
        this.statusEl
      ),
      this.unread,
    ]);
    this.addSelectUserEvent();
    getHistory(this.username);
    onMsgHistoryByUser((messages) => {
      this.setUnreadCounter(messages.filter((msg) => msg.from === this.username && !msg.status.isReaded).length);
    }, this.username);
    document.addEventListener('updateUnread', (event: CustomEvent<UpdateUnreadEvent>) => {
      if (event.detail.username === this.username) {
        this.setUnreadCounter(event.detail.count);
      }
    });
    onSendMsgByUser(() => {
      this.setUnreadCounter(this.unreadCounter + 1);
    }, this.username);
  }

  get curStatus() {
    return this.status;
  }

  set curStatus(status: boolean) {
    this.status = status;
    this.statusEl.setAttribute('data-status', this.status ? 'online' : 'offline');
  }

  get curUsername() {
    return this.username;
  }

  set curUsername(username: string) {
    this.username = username;
    this.usernameEl.setText(this.username);
  }

  addSelectUserEvent() {
    const event = new CustomEvent<SelectUserEvent>('selectUser', {
      detail: {
        username: this.username,
        status: this.status,
      },
    });
    this.node.addEventListener('click', () => document.dispatchEvent(event));
    document.addEventListener('selectUser', (e: CustomEvent<SelectUserEvent>) => {
      if (e.detail.username === this.username) {
        this.node.dataset.selected = 'true';
      } else {
        this.node.dataset.selected = 'false';
      }
    });
  }

  setUnreadCounter(count: number) {
    this.unreadCounter = count;
    if (this.unreadCounter > 0) {
      this.unread.setText(this.unreadCounter.toString());
      this.unread.removeClassName('hidden');
    } else {
      this.unread.addClassName('hidden');
    }
  }
}
