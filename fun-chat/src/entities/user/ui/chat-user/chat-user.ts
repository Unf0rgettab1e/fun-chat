import { Component } from '@shared/component';
import { div, img, span } from '@shared/tags';
import avatar from '@shared/assets/icons/user-circle.svg';
import styles from './chat-user.module.css';

export default class ChatUser extends Component<HTMLLIElement> {
  private statusEl = span({ className: styles.chatUserStatus });

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
    this.appendChild(
      div(
        { className: styles.chatUserInfo },
        img({ className: styles.chatUserAvatar, src: avatar }),
        this.usernameEl,
        this.statusEl
      )
    );
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
}
