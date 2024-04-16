export enum AppRoutes {
  HOME = 'home',
  ABOUT = 'about',
  LOGIN = 'login',
  NOT_FOUND = 'not_found',
}

export const getHomeRoute = () => '/';
export const getLoginRoute = () => '/login';
export const getAboutRoute = () => '/about';
export const getNotFoundRoute = () => '*';
