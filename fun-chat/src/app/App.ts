import { Component } from '@shared/component';
import { Router, getRouter } from './router';

class App extends Component {
  private router: Router = getRouter();

  constructor() {
    super({ className: 'app' });

    this.render();
  }

  setPage(page: Component) {
    this.destroyChildren();
    this.appendChild(page);
  }

  render() {
    document.addEventListener('DOMContentLoaded', () => {
      this.router.validateCurrentPath();
    });
    document.body.append(this.node);
  }
}

const app = new App();

export default app;
