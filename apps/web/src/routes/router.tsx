import {
  Router,
  RootRoute,
  Route,
  createBrowserHistory,
} from '@tanstack/react-router'
import { QueryClient } from '@tanstack/react-query'

import { Layout } from '../components/Layout'
import { HomePage } from '../pages/Home'
import { StudentProfilePage } from '../pages/StudentProfile'
import { CompanyProfilePage } from '../pages/CompanyProfile'

export const queryClient = new QueryClient()

const rootRoute = new RootRoute({
  component: Layout,
})

const homeRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

const studentRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/students/$studentId',
  component: StudentProfilePage,
})

const companyRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/companies/$companyId',
  component: CompanyProfilePage,
})

const routeTree = rootRoute.addChildren([
  homeRoute,
  studentRoute,
  companyRoute,
])

export const router = new Router({
  routeTree,
  history: createBrowserHistory(),
  context: {
    queryClient,
  },
})

// typing pour TanStack Router
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
