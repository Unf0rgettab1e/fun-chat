import { Component } from '@shared/component';
import { Message } from '@shared/api';
import { img, p, span } from '@shared/tags';
import { getUser } from '@entities/user';
import sendedIcon from '@shared/assets/icons/msg-sended.svg';
import deliveredIcon from '@shared/assets/icons/msg-delivered.svg';
import readedIcon from '@shared/assets/icons/msg-readed.svg';
import styles from './message.module.css';
import { formatDate } from '../utils/format';

export default class ChatMessage extends Component {
  private message: Message;

  private text = p({
    className: `${styles.messageText}`,
  });

  private header = span({
    className: `${styles.messageHeader}`,
  });

  private footer = span({
    className: `${styles.messageFooter}`,
  });

  constructor(message: Message) {
    super({
      tag: 'div',
      className: `${styles.message} ${message.from === getUser().username ? styles.you : styles.someone}`,
    });

    this.message = message;

    this.render();
  }

  render() {
    let statusIcon;
    if (!this.message.status.isDelivered) {
      statusIcon = sendedIcon;
    } else if (this.message.status.isDelivered && this.message.status.isReaded) {
      statusIcon = readedIcon;
    } else {
      statusIcon = deliveredIcon;
    }

    this.text.getNode().innerHTML = this.message.text;
    this.header.appendChildren([
      span({
        text: `${this.message.from === getUser().username ? 'You' : this.message.from}`,
        className: styles.messageFrom,
      }),
      span({ text: `${formatDate(new Date(this.message.datetime))}`, className: styles.messageTime }),
    ]);
    if (this.message.status.isEdited) {
      this.footer.appendChild(span({ text: 'edited', className: styles.messageEdited }));
    }
    if (this.message.from === getUser().username) {
      this.footer.appendChild(
        img({
          src: statusIcon,
          className: styles.messageStatus,
        })
      );
    }
    this.appendChildren([this.header, this.text, this.footer]);
  }
}
