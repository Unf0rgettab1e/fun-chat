import { Component } from '@shared/component';
import { Message } from '@shared/api';
import { img, p, span } from '@shared/tags';
import { getUser } from '@entities/user';
import sendedIcon from '@shared/assets/icons/msg-sended.svg';
import deliveredIcon from '@shared/assets/icons/msg-delivered.svg';
import readedIcon from '@shared/assets/icons/msg-readed.svg';
import styles from './message.module.css';
import { formatDate } from '../utils/format';
import { onMsgDelivered, onMsgEdited, onMsgReaded } from '../api/chatting.api';

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

  private status = img({
    src: sendedIcon,
    className: styles.messageStatus,
  });

  private edited = span({ text: 'edited', className: styles.messageEdited });

  constructor(message: Message) {
    super({
      tag: 'div',
      className: `${styles.message} ${message.from === getUser().username ? styles.you : styles.someone}`,
    });

    this.message = message;

    this.render();
  }

  render() {
    this.text.getNode().innerHTML = this.message.text;
    this.header.appendChildren([
      span({
        text: `${this.message.from === getUser().username ? 'You' : this.message.from}`,
        className: styles.messageFrom,
      }),
      span({ text: `${formatDate(new Date(this.message.datetime))}`, className: styles.messageTime }),
    ]);
    if (this.message.status.isEdited) {
      this.footer.appendChild(this.edited);
    }
    if (this.message.from === getUser().username) {
      this.footer.appendChild(this.status);
      this.changeMsgStatus(this.message);
    }
    this.appendChildren([this.header, this.text, this.footer]);
    this.onChangeStatus();
  }

  changeMsgStatus(message: Message) {
    this.status.getNode().src = this.chooseIcon(message);
  }

  chooseIcon({ status }: Message) {
    if (!status.isDelivered) {
      return sendedIcon;
    }
    if (status.isDelivered && status.isReaded) {
      return readedIcon;
    }
    return deliveredIcon;
  }

  onChangeStatus() {
    onMsgDelivered(() => {
      this.status.getNode().src = deliveredIcon;
    }, this.message.id);
    onMsgReaded(() => {
      this.status.getNode().src = readedIcon;
      // console.log(this.message.text);
    }, this.message.id);
    onMsgEdited(() => {
      this.footer.insertToStart(this.edited);
    }, this.message.id);
  }
}
