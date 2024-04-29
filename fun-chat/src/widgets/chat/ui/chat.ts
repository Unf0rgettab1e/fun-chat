import { Component } from '@shared/component';
import { button, div, img, textarea } from '@shared/tags';
import sendIcon from '@shared/assets/icons/send.svg';
import avatar from '@shared/assets/icons/user-circle.svg';
import { assertIsInstance } from '@shared/utils/asserts';
import { Message, MsgSendingResponse, User } from '@shared/api';
import { SelectUserEvent } from '@entities/user';
import {
  ChatMessage,
  DeleteMsgEvent,
  EditMsgEvent,
  UpdateUnreadEvent,
  getHistory,
  offSendMsgByUser,
  onMsgHistory,
  onSendMsgByUser,
  readMsg,
  sendMsg,
} from '@entities/message';
import { onUsersLogin, onUsersLogout } from '@entities/user/api/all-users.api';
import styles from './chat.module.css';

export default class Chat extends Component {
  private writeInput = textarea({
    className: styles.sendFormInput,
    placeholder: 'Write message...',
    disabled: true,
  });

  private sendBtn = button(
    {
      type: 'submit',
      className: styles.sendFormSubmit,
      disabled: true,
      onClick: () => {
        this.sendMessageForm.getNode().requestSubmit();
      },
    },
    img({ src: sendIcon, className: styles.sendFormSubmitIcon })
  );

  private sendMessageForm = new Component<HTMLFormElement>(
    {
      tag: 'form',
      className: styles.sendForm,
      onsubmit: (e) => {
        e.preventDefault();
        if (this.editable.isEditMode) {
          this.editable.message?.editMsgText(this.writeInput.getNode().value.replace(/\n/g, '<br>'));
          this.editable = { isEditMode: false, message: null };
        } else {
          this.sendMsgHandler();
        }
        this.readMsgs();
        this.resetForm();
      },
    },
    this.writeInput,
    this.sendBtn
  );

  private messagesContainer = div({ className: `${styles.messages} scrollable` });

  private separator = div({ className: styles.separator, text: 'Unread messages' });

  private member: {
    name: string;
    status: boolean;
  } = {
    name: '',
    status: false,
  };

  private memberNameDiv = div({ className: styles.memberName, text: 'Select partner to start chatting' });

  private chatMemberInfo = div(
    {
      className: styles.memberInfo,
    },
    img({ className: styles.memberAvatar, src: avatar }),
    this.memberNameDiv
  );

  private noMessages = div({ className: styles.noMessages, text: 'No messages here yet' });

  private unReadedMessages: {
    msg: Message;
    component: ChatMessage;
  }[] = [];

  private isSetReadEvents: boolean = false;

  private currentMemberListener: (msg: MsgSendingResponse) => void = () => {};

  private editable: {
    message: ChatMessage | null;
    isEditMode: boolean;
  } = {
    message: null,
    isEditMode: false,
  };

  constructor() {
    super({ tag: 'section', className: styles.chat });

    this.render();
  }

  render() {
    this.appendChildren([this.chatMemberInfo, this.messagesContainer, this.sendMessageForm]);
    this.messagesContainer.appendChild(div({ className: styles.noMessages, text: 'Select partner to start chatting' }));
    this.setEventHandlers();
    this.setHistoryListener();
  }

  autoResize(element: HTMLTextAreaElement) {
    const taEl = element;
    taEl.style.height = 'auto';
    taEl.style.height = `${taEl.scrollHeight + 2}px`;
    if (!element.value) {
      taEl.style.height = 'auto';
    }
    this.writeInput.getNode().style.maxHeight = '100px';
  }

  setMember(user: User) {
    this.member = {
      name: user.login,
      status: user.isLogined,
    };
    this.memberNameDiv.setText(this.member.name);
    this.memberNameDiv.getNode().dataset.status = this.member.status ? 'online' : 'offline';
  }

  setEventHandlers() {
    this.writeInput.getNode().addEventListener('input', (event) => {
      const ta = event.target;
      assertIsInstance(ta, HTMLTextAreaElement);
      this.autoResize(ta);
      if (ta.value.trim()) {
        this.activateSendBtn();
      } else {
        this.deactivateSendBtn();
      }
    });

    this.writeInput.getNode().addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();

        if (this.writeInput.getNode().value.trim()) {
          this.sendMessageForm.getNode().requestSubmit();
        }
      }
    });
    onUsersLogin((user) => this.currentMemberStatusHandler(user));
    onUsersLogout((user) => this.currentMemberStatusHandler(user));
    document.addEventListener('selectUser', (event: CustomEvent<SelectUserEvent>) => this.selectUserHandler(event));
    document.addEventListener('editMessage', (event: CustomEvent<EditMsgEvent>) => this.editMessageHandler(event));
    document.addEventListener('messageDeleted', (event: CustomEvent<DeleteMsgEvent>) =>
      this.messageDeletedHandler(event)
    );
  }

  currentMemberStatusHandler(user: User) {
    if (this.member.name === user.login) {
      this.member.status = user.isLogined;
      this.memberNameDiv.getNode().dataset.status = this.member.status ? 'online' : 'offline';
    }
  }

  selectUserHandler(e: CustomEvent<SelectUserEvent>) {
    if (this.member.name === e.detail.username) {
      return;
    }
    if (this.member.name) {
      offSendMsgByUser(this.currentMemberListener);
    }
    const { username, status } = e.detail;
    this.member = {
      name: username,
      status,
    };
    this.messagesContainer.destroyChildren();
    getHistory(username, true);
    this.currentMemberListener = onSendMsgByUser(this.addNewMessage.bind(this), this.member.name);
    this.memberNameDiv.setText(this.member.name);
    this.memberNameDiv.getNode().dataset.status = this.member.status ? 'online' : 'offline';
    this.activateInput();
    this.resetForm();
    this.setReadMsgsActions();
  }

  editMessageHandler(e: CustomEvent<EditMsgEvent>) {
    const { message } = e.detail;
    this.editable.isEditMode = true;
    this.editable.message = message;
    this.writeInput.getNode().value = message.getText().replace(/<br>/g, '\n');
    this.writeInput.getNode().focus();
    this.autoResize(this.writeInput.getNode());
    this.deactivateSendBtn();
  }

  messageDeletedHandler(e: CustomEvent<DeleteMsgEvent>) {
    const { msgId } = e.detail;
    const index = this.unReadedMessages.findIndex((msg) => msg.msg.id === msgId);
    if (index !== -1) {
      this.unReadedMessages.splice(index, 1);
      if (!this.unReadedMessages.length) {
        this.deleteSeparator();
      }
      if (!this.messagesContainer.getNode().children.length) {
        this.messagesContainer.appendChild(this.noMessages);
      }
      this.dispatchUnreadMessages();
    }
  }

  setHistoryListener() {
    onMsgHistory((messages) => {
      if (this.unReadedMessages.length) {
        this.deleteSeparator();
        this.unReadedMessages = [];
      }
      if (!messages.length) {
        this.messagesContainer.appendChild(this.noMessages);
        return;
      }
      messages.reverse().forEach((message) => {
        this.messagesContainer.appendChild(this.addUnReadedMessage(message));
      });
      this.unReadedMessages.reverse();
      this.scrollToSeparator();
    });
  }

  addNewMessage(message: Message) {
    this.noMessages.destroy();
    this.messagesContainer.insertToStart(this.addUnReadedMessage(message));
    if (message.from === this.member.name) {
      this.scrollToSeparator();
      this.dispatchUnreadMessages();
    } else if (message.to === this.member.name) {
      this.scrollToBottom();
    }
  }

  dispatchUnreadMessages() {
    const event = new CustomEvent<UpdateUnreadEvent>('updateUnread', {
      detail: {
        count: this.unReadedMessages.length,
        username: this.member.name,
      },
    });
    document.dispatchEvent(event);
  }

  addUnReadedMessage(message: Message) {
    const component = new ChatMessage(message);
    if (message.from === this.member.name && !message.status.isReaded) {
      this.unReadedMessages.push({
        msg: message,
        component,
      });
    }
    return component;
  }

  sendMsgHandler() {
    this.noMessages.destroy();
    const message = {
      to: this.member.name,
      text: this.writeInput.getNode().value.replace(/\n/g, '<br>'),
    };
    sendMsg(message);
  }

  resetForm() {
    this.writeInput.getNode().value = '';
    this.autoResize(this.writeInput.getNode());
    this.deactivateSendBtn();
  }

  scrollToBottom() {
    this.messagesContainer.getChildren()[0].getNode().scrollIntoView({ behavior: 'smooth' });
  }

  scrollToSeparator() {
    if (this.unReadedMessages.length) {
      this.addSeparator();
      this.separator.getNode().scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      this.scrollToBottom();
    }
  }

  activateInput() {
    this.writeInput.getNode().disabled = false;
  }

  activateSendBtn() {
    this.sendBtn.getNode().disabled = false;
  }

  deactivateSendBtn() {
    this.sendBtn.getNode().disabled = true;
  }

  setReadMsgsActions() {
    if (!this.isSetReadEvents) {
      this.messagesContainer.getNode().addEventListener('click', () => this.chatClickHandler());
      this.messagesContainer.getNode().addEventListener('wheel', () => this.chatScrollHandler());
      onSendMsgByUser(this.addNewMessage.bind(this));
      this.isSetReadEvents = true;
    }
  }

  chatClickHandler() {
    this.readMsgs();
  }

  chatScrollHandler() {
    this.readMsgs();
  }

  readMsgs() {
    if (this.unReadedMessages.length) {
      this.unReadedMessages.forEach((msg) => {
        readMsg(msg.msg.id);
      });
      this.unReadedMessages = [];
      this.dispatchUnreadMessages();
      this.deleteSeparator();
    }
  }

  addSeparator() {
    this.unReadedMessages[0].component.getNode().after(this.separator.getNode());
  }

  deleteSeparator() {
    this.messagesContainer.getNode().removeChild(this.separator.getNode());
  }
}
