import { Component } from '@shared/component';
import { div, heading } from '@shared/tags';
import { Footer } from '@shared/ui/footer';
import { Header } from '@widgets/header';
import styles from './home-page.module.css';

export default class HomePage extends Component {
  constructor() {
    super({ className: styles.home });
    this.render();
  }

  render() {
    this.appendChild(new Header());
    this.appendChild(div({ className: styles.homeContent }, heading({ text: 'Home Page' }, 2)));
    this.appendChild(new Footer());
  }
}
