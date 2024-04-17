import { TRouterConfig, routerConfig } from './config';
import { AppRoutes } from './const';

export class Router {
  private config: TRouterConfig;

  constructor(config: TRouterConfig) {
    this.config = config;
  }

  setHistory(url: string) {
    window.history.pushState(null, '', url);
  }

  navigate(to: AppRoutes) {
    const route = this.config[to];
    this.setHistory(route.path);
    route.component();
  }

  validateCurrentPath = () => {
    const route = Object.entries(this.config).find((r) => r[1].path === window.location.pathname);
    if (route) {
      this.navigate(route[0] === AppRoutes.LOGIN ? AppRoutes.HOME : (route[0] as AppRoutes));
    } else {
      this.config[AppRoutes.NOT_FOUND].component();
    }
  };
}

const router = new Router(routerConfig);

export default () => router;
