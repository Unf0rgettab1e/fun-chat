import { Component } from '@shared/component';
import { Footer } from '@shared/ui/footer';
import { Header } from '@widgets/header';
import { div } from '@shared/tags';
import { ChatUsers } from '@widgets/chat-users';
import styles from './home-page.module.css';

export default class HomePage extends Component {
  private chatUsers = new ChatUsers();

  constructor() {
    super({ className: styles.home });
    this.render();
  }

  render() {
    this.appendChild(new Header());
    this.appendChild(
      new Component(
        { tag: 'main', className: styles.main },
        div({ className: styles.content }, this.chatUsers, new Component({ tag: 'section', className: styles.chat }))
      )
    );
    this.appendChild(new Footer());
  }
}
