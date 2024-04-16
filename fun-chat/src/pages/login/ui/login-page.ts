import { Component } from '@shared/component';
import { heading } from '@shared/tags';

export default class LoginPage extends Component {
  constructor() {
    super({ className: 'about-page' });
    this.render();
  }

  render() {
    this.appendChild(heading({ text: 'Fun Chat Login' }, 1));
  }
}
