import { Component } from '@shared/component';
import { button, div, img, textarea } from '@shared/tags';
import sendIcon from '@shared/assets/icons/send.svg';
import avatar from '@shared/assets/icons/user-circle.svg';
import { assertIsInstance } from '@shared/utils/asserts';
import { Message, User } from '@shared/api';
import { SelectUserEvent, getUser } from '@entities/user';
import { ChatMessage, onMsgHistory, requestCurrentMsgHistory } from '@entities/message';
import styles from './chat.module.css';

declare global {
  interface Document {
    dispatchEvent(event: CustomEvent<SelectUserEvent>): boolean;
    addEventListener(
      type: 'selectUser',
      listener: (event: CustomEvent<SelectUserEvent>) => void,
      options?: boolean | AddEventListenerOptions
    ): void;
  }
}

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
        this.sendMsgHandler();
      },
    },
    this.writeInput,
    this.sendBtn
  );

  private messagesContainer = div({ className: `${styles.messages} scrollable` });

  private member: {
    name: string;
    status: boolean;
  } = {
    name: '',
    status: false,
  };

  private memberNameDiv = div({ className: styles.memberName, text: 'Pick partner to start chatting' });

  private chatMemberInfo = div(
    {
      className: styles.memberInfo,
    },
    img({ className: styles.memberAvatar, src: avatar }),
    this.memberNameDiv
  );

  private noMessages = div({ className: styles.noMessages, text: 'No messages here yet' });

  constructor() {
    super({ tag: 'section', className: styles.chat });

    this.render();
  }

  render() {
    this.appendChildren([this.chatMemberInfo, this.messagesContainer, this.sendMessageForm]);
    this.setEventHandlers();
    this.setHistoryListener();
  }

  autoResize(element: HTMLTextAreaElement) {
    const taEl = element;
    taEl.style.height = 'auto';
    taEl.style.height = `${taEl.scrollHeight}px`;
    if (!element.value) {
      taEl.style.height = '48px';
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
          this.resetForm();
        }
      }
    });

    document.addEventListener('selectUser', (event: CustomEvent<SelectUserEvent>) => {
      const { username, status } = event.detail;
      this.member = {
        name: username,
        status,
      };
      this.messagesContainer.destroyChildren();
      requestCurrentMsgHistory(username);
      this.memberNameDiv.setText(this.member.name);
      this.memberNameDiv.getNode().dataset.status = this.member.status ? 'online' : 'offline';
      this.activateInput();
      this.deactivateSendBtn();
    });
  }

  setHistoryListener() {
    onMsgHistory((messages) => {
      messages.reverse().forEach((message) => {
        this.messagesContainer.appendChild(new ChatMessage(message));
      });
      if (!messages.length) {
        this.messagesContainer.appendChild(this.noMessages);
      }
      this.scrollToBottom();
    });
  }

  sendMsgHandler() {
    this.noMessages.destroy();
    const message: Message = {
      id: `MSG_FROM_${Date.now()}`,
      from: getUser().username,
      to: this.member.name,
      text: this.writeInput.getNode().value.replace(/\n/g, '<br>'),
      datetime: Date.now(),
      status: { isDelivered: false, isReaded: false, isEdited: false },
    };
    this.messagesContainer.insertBefore(new ChatMessage(message), this.messagesContainer.getNode().firstChild);
    this.scrollToBottom();
  }

  resetForm() {
    this.writeInput.getNode().value = '';
    this.autoResize(this.writeInput.getNode());
  }

  scrollToBottom() {
    this.messagesContainer.getNode().scrollTop = this.messagesContainer.getNode().scrollHeight;
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
}
