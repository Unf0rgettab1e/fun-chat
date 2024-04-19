import { Component } from '@shared/component';
import { AppRoutes, Router, getRouter } from './router';
import { getAboutRoute } from './router/const';
import './providers/store';
import { getStoredUserData } from '@/entities/user';

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
      if (!getStoredUserData() && window.location.pathname !== getAboutRoute()) {
        this.router.navigate(AppRoutes.LOGIN);
        return;
      }
      this.router.validateCurrentPath();
    });
    document.body.append(this.node);
  }
}

const app = new App();

export default app;
