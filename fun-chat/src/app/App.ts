import { Component } from '@shared/component';
import { AppRoutes, Router, getRouter } from './router';
import { getAboutRoute } from './router/const';

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
      if (!sessionStorage.getItem('userData') && window.location.pathname !== getAboutRoute()) {
        this.router.navigate(AppRoutes.LOGIN);
        console.log('no user data', window.location.pathname);

        return;
      }
      console.log('user data');
      this.router.validateCurrentPath();
    });
    document.body.append(this.node);
  }
}

const app = new App();

export default app;
