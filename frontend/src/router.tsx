import { Suspense, lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { RequireAuth } from './components/guards/RequireAuth'
import { RedirectIfAuth } from './components/guards/RedirectIfAuth'
import { AppLayout } from './components/layout/AppLayout'
import { PublicLayout } from './components/layout/PublicLayout'

const LandingPage = lazy(() => import('./pages/LandingPage').then((module) => ({ default: module.LandingPage })))
const RegisterPage = lazy(() => import('./pages/RegisterPage').then((module) => ({ default: module.RegisterPage })))
const LoginPage = lazy(() => import('./pages/LoginPage').then((module) => ({ default: module.LoginPage })))
const GroupsListPage = lazy(() => import('./pages/GroupsListPage').then((module) => ({ default: module.GroupsListPage })))
const CreateGroupPage = lazy(() => import('./pages/CreateGroupPage').then((module) => ({ default: module.CreateGroupPage })))
const GroupDashboardPage = lazy(() =>
  import('./pages/GroupDashboardPage').then((module) => ({ default: module.GroupDashboardPage })),
)
const ExpenseListPage = lazy(() => import('./pages/ExpenseListPage').then((module) => ({ default: module.ExpenseListPage })))
const CreateExpensePage = lazy(() =>
  import('./pages/CreateExpensePage').then((module) => ({ default: module.CreateExpensePage })),
)
const EditExpensePage = lazy(() => import('./pages/EditExpensePage').then((module) => ({ default: module.EditExpensePage })))
const CreateSettlementPage = lazy(() =>
  import('./pages/CreateSettlementPage').then((module) => ({ default: module.CreateSettlementPage })),
)
const LedgerHistoryPage = lazy(() =>
  import('./pages/LedgerHistoryPage').then((module) => ({ default: module.LedgerHistoryPage })),
)
const MembersPage = lazy(() => import('./pages/MembersPage').then((module) => ({ default: module.MembersPage })))
const InvitesPage = lazy(() => import('./pages/InvitesPage').then((module) => ({ default: module.InvitesPage })))
const NotificationPreferencesPage = lazy(() =>
  import('./pages/NotificationPreferencesPage').then((module) => ({ default: module.NotificationPreferencesPage })),
)
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })))

const withSuspense = (element: React.JSX.Element): React.JSX.Element => (
  <Suspense fallback={<div className="p-4 text-sm text-slate-500">Carregando...</div>}>{element}</Suspense>
)

export const router = createBrowserRouter([
  {
    element: <RedirectIfAuth />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { path: '/', element: withSuspense(<LandingPage />) },
          { path: '/register', element: withSuspense(<RegisterPage />) },
          { path: '/login', element: withSuspense(<LoginPage />) },
        ],
      },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/groups', element: withSuspense(<GroupsListPage />) },
          { path: '/groups/new', element: withSuspense(<CreateGroupPage />) },
          { path: '/groups/:groupId', element: withSuspense(<GroupDashboardPage />) },
          { path: '/expenses', element: withSuspense(<ExpenseListPage />) },
          { path: '/expenses/new', element: withSuspense(<CreateExpensePage />) },
          { path: '/expenses/:expenseId/edit', element: withSuspense(<EditExpensePage />) },
          { path: '/balances', element: withSuspense(<GroupDashboardPage />) },
          { path: '/settlements/new', element: withSuspense(<CreateSettlementPage />) },
          { path: '/history', element: withSuspense(<LedgerHistoryPage />) },
          { path: '/members', element: withSuspense(<MembersPage />) },
          { path: '/invites', element: withSuspense(<InvitesPage />) },
          { path: '/preferences', element: withSuspense(<NotificationPreferencesPage />) },
        ],
      },
    ],
  },
  { path: '*', element: withSuspense(<NotFoundPage />) },
])
