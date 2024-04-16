import { Component } from '@shared/component';
import { heading } from '@shared/tags';

export default class AboutPage extends Component {
  constructor() {
    super({ className: 'about-page' });
    this.render();
  }

  render() {
    this.appendChild(heading({ text: 'About Fun Chat' }, 1));
  }
}
