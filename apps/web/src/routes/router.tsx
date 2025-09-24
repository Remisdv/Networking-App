import { Router, RootRoute, Route, createBrowserHistory } from '@tanstack/react-router';
import { QueryClient } from '@tanstack/react-query';

import { Layout } from '../components/Layout';
import { HomePage } from '../pages/Home';
import { RegisterPage } from '../pages/Register';

export const queryClient = new QueryClient();

const rootRoute = new RootRoute({
  component: Layout,
});

const homeRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const registerRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterPage,
});

const routeTree = rootRoute.addChildren([homeRoute, registerRoute]);

export const router = new Router({
  routeTree,
  history: createBrowserHistory(),
  context: {
    queryClient,
  },
});

// typing pour TanStack Router
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
