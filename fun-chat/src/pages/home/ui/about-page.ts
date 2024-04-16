import { Component } from '@shared/component';
import { heading } from '@shared/tags';

export default class HomePage extends Component {
  constructor() {
    super({ className: 'home-page' });
    this.render();
  }

  render() {
    this.appendChild(heading({ text: 'Fun Chat Home Page' }, 1));
  }
}
