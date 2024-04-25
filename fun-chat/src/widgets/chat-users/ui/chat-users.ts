import { Component } from '@shared/component';
import { button, img, input, span } from '@shared/tags';
import { ChatUser, getAllUsers, onUpdateUsers, requestAllUsers } from '@entities/user';
import searchIcon from '@shared/assets/icons/search.svg';
import clearIcon from '@shared/assets/icons/clear.svg';
import styles from './chat-users.module.css';

export default class ChatUsers extends Component {
  private searchInput = input({
    type: 'text',
    placeholder: 'Search',
    className: styles.usersSearchInput,
    onInput: () => {
      this.searchUsersHandler(this.searchInput.getNode().value);
    },
  });

  private btnClear = button(
    {
      type: 'reset',
      className: `${styles.usersSearchClear} hidden`,
      onClick: () => {
        this.searchInput.getNode().value = '';
        this.searchUsersHandler('');
      },
    },
    img({ src: clearIcon, className: styles.usersClearIcon })
  );

  private search = new Component<HTMLFormElement>(
    {
      tag: 'form',
      className: styles.usersSearch,
      onsubmit: (e) => {
        e.preventDefault();
      },
    },
    this.searchInput,
    img({ src: searchIcon, className: styles.usersSearchIcon }),
    this.btnClear,
    input({ type: 'submit', value: '', className: styles.usersSearchSubmit })
  );

  private userList = new Component<HTMLUListElement>({ tag: 'ul', className: `${styles.usersList} scrollable` });

  private trigger = span({ className: styles.trigger, onclick: () => this.triggerHandler() });

  constructor() {
    super({ tag: 'section', className: styles.users });

    this.render();
  }

  render() {
    requestAllUsers((users) => {
      users.forEach((user) => {
        this.userList.appendChild(new ChatUser(user.login, user.isLogined));
      });
    });
    onUpdateUsers((user, isNew) => {
      if (isNew) {
        this.userList.appendChild(new ChatUser(user.login, user.isLogined));
      } else {
        const chatUser = this.userList.getChildren().find((u) => u instanceof ChatUser && u.curUsername === user.login);
        if (chatUser instanceof ChatUser) {
          chatUser.curStatus = user.isLogined;
        }
      }
    });
    document.addEventListener('selectUser', () => {
      this.trigger.removeClassName('hidden');
      this.removeClassName(styles.show);
      document.removeEventListener('click', this.hideUsers);
    });

    this.appendChildren([this.search, this.userList, this.trigger]);
  }

  searchUsersHandler(name: string) {
    if (!name) {
      this.btnClear.addClassName('hidden');
    } else {
      this.btnClear.removeClassName('hidden');
    }
    this.userList.destroyChildren();
    getAllUsers().forEach((user) => {
      if (user.login.toLowerCase().includes(name.toLowerCase())) {
        this.userList.appendChild(new ChatUser(user.login, user.isLogined));
      }
    });
  }

  triggerHandler() {
    this.toggleClassName(styles.show);
    document.addEventListener('click', this.hideUsers);
  }

  hideUsers = (e: Event) => {
    if (e.target !== this.node && e.target !== this.trigger.getNode() && !this.node.contains(e.target)) {
      this.removeClassName(styles.show);
      document.removeEventListener('click', this.hideUsers);
    }
  };
}
