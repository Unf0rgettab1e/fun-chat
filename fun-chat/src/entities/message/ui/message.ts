import { Component } from '@shared/component';
import { Message } from '@shared/api';
import { p } from '@shared/tags';
import { getUser } from '@entities/user';
import styles from './message.module.css';

export default class ChatMessage extends Component {
  private message: Message;

  constructor(message: Message) {
    super({
      tag: 'div',
      className: `${styles.message} ${message.from === getUser().username ? styles.you : styles.someone}`,
    });

    this.message = message;

    this.render();
  }

  render() {
    const text = p({
      className: `${styles.messageText}`,
      // text: this.message.text,
    });
    text.getNode().innerHTML = this.message.text;
    this.appendChildren([text]);
  }
}
