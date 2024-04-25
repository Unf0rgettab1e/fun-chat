import { Component } from '@shared/component';
import { Message } from '@shared/api';
import { img, p, span } from '@shared/tags';
import { getUser } from '@entities/user';
import sendedIcon from '@shared/assets/icons/msg-sended.svg';
import deliveredIcon from '@shared/assets/icons/msg-delivered.svg';
import readedIcon from '@shared/assets/icons/msg-readed.svg';
import editIcon from '@shared/assets/icons/edit.svg';
import deleteIcon from '@shared/assets/icons/delete.svg';
import ContextMenu from '@shared/ui/context-menu/context-menu';
import styles from './message.module.css';
import { formatDate } from '../utils/format';
import { deleteMsg, editMsg, onMsgDeleted, onMsgDelivered, onMsgEdited, onMsgReaded } from '../api/chatting.api';
import { DeleteMsgEvent, EditMsgEvent } from '../model/types/events';

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

  private delete = new Component<HTMLLIElement>(
    {
      tag: 'li',
      className: styles.contextMenuItem,
      onclick: () => {
        deleteMsg(this.message.id);
        this.destroyCtxMenu();
      },
    },
    img({ src: deleteIcon, className: styles.contextMenuIcon }),
    span({ text: 'Delete', className: `${styles.contextMenuText} ${styles.delete}` })
  );

  private edit = new Component<HTMLLIElement>(
    {
      tag: 'li',
      className: styles.contextMenuItem,
      onclick: () => {
        const event = new CustomEvent<EditMsgEvent>('editMessage', {
          detail: {
            message: this,
          },
        });
        document.dispatchEvent(event);
      },
    },
    img({ src: editIcon, className: styles.contextMenuIcon }),
    span({ text: 'Edit', className: styles.contextMenuText })
  );

  private ctxMenu: ContextMenu | null = null;

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
    if (this.message.from === getUser().username) {
      this.node.addEventListener('contextmenu', (e) => this.contextMenuHandler(e));
      document.addEventListener('click', () => this.destroyCtxMenu());
    }
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
    }, this.message.id);
    onMsgEdited((text) => {
      this.message.text = text;
      this.text.getNode().innerHTML = text;
      this.footer.insertToStart(this.edited);
    }, this.message.id);
    onMsgDeleted(() => {
      this.destroy();
      const event = new CustomEvent<DeleteMsgEvent>('messageDeleted', {
        detail: {
          msgId: this.message.id,
        },
      });
      document.dispatchEvent(event);
    }, this.message.id);
  }

  contextMenuHandler(e: MouseEvent) {
    if (e.currentTarget === this.node) {
      e.preventDefault();
      this.destroyCtxMenu();
      this.ctxMenu = new ContextMenu([this.edit, this.delete]);
      this.ctxMenu.getNode().style.left = `${e.clientX + 4}px`;
      this.ctxMenu.getNode().style.top = `${e.clientY + 4}px`;
    }
  }

  destroyCtxMenu() {
    if (this.ctxMenu) {
      this.ctxMenu.getNode().remove();
      this.ctxMenu = null;
    }
  }

  getText() {
    return this.message.text;
  }

  editMsgText(text: string) {
    editMsg(this.message.id, text);
  }
}
