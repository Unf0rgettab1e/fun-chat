import app from '@app/App';
import { div } from '@shared/tags';
import { HomePage } from '@/pages/home';
import { AppRoutes, getAboutRoute, getHomeRoute, getLoginRoute } from './const';
import { LoginPage } from '@/pages/login';
import { AboutPage } from '@/pages/about';

export type RouteProps = {
  path: string;
  component: () => void;
};

export type TRouterConfig = Record<AppRoutes, RouteProps>;

export const routerConfig: TRouterConfig = {
  [AppRoutes.HOME]: {
    path: getHomeRoute(),
    component: () => HomePage().then(({ default: Home }) => app.setPage(new Home())),
  },
  [AppRoutes.LOGIN]: {
    path: getLoginRoute(),
    component: () => LoginPage().then(({ default: Login }) => app.setPage(new Login())),
  },
  [AppRoutes.ABOUT]: {
    path: getAboutRoute(),
    component: () => AboutPage().then(({ default: About }) => app.setPage(new About())),
  },
  [AppRoutes.NOT_FOUND]: {
    path: '*',
    component: () => {
      app.setPage(div({ text: 'Page not found!' }));
    },
  },
};

export const getRoute = (route: AppRoutes): RouteProps => routerConfig[route];
