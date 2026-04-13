import { createBrowserRouter } from 'react-router-dom'
import { RequireAuth } from './components/guards/RequireAuth'
import { RedirectIfAuth } from './components/guards/RedirectIfAuth'
import { AppLayout } from './components/layout/AppLayout'
import { PublicLayout } from './components/layout/PublicLayout'
import { CreateExpensePage } from './pages/CreateExpensePage'
import { CreateGroupPage } from './pages/CreateGroupPage'
import { CreateSettlementPage } from './pages/CreateSettlementPage'
import { EditExpensePage } from './pages/EditExpensePage'
import { ExpenseListPage } from './pages/ExpenseListPage'
import { GroupDashboardPage } from './pages/GroupDashboardPage'
import { GroupsListPage } from './pages/GroupsListPage'
import { InvitesPage } from './pages/InvitesPage'
import { LandingPage } from './pages/LandingPage'
import { LedgerHistoryPage } from './pages/LedgerHistoryPage'
import { LoginPage } from './pages/LoginPage'
import { MembersPage } from './pages/MembersPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { NotificationPreferencesPage } from './pages/NotificationPreferencesPage'
import { RegisterPage } from './pages/RegisterPage'

export const router = createBrowserRouter([
  {
    element: <RedirectIfAuth />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { path: '/', element: <LandingPage /> },
          { path: '/register', element: <RegisterPage /> },
          { path: '/login', element: <LoginPage /> },
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
          { path: '/groups', element: <GroupsListPage /> },
          { path: '/groups/new', element: <CreateGroupPage /> },
          { path: '/groups/:groupId', element: <GroupDashboardPage /> },
          { path: '/expenses', element: <ExpenseListPage /> },
          { path: '/expenses/new', element: <CreateExpensePage /> },
          { path: '/expenses/:expenseId/edit', element: <EditExpensePage /> },
          { path: '/balances', element: <GroupDashboardPage /> },
          { path: '/settlements/new', element: <CreateSettlementPage /> },
          { path: '/history', element: <LedgerHistoryPage /> },
          { path: '/members', element: <MembersPage /> },
          { path: '/invites', element: <InvitesPage /> },
          { path: '/preferences', element: <NotificationPreferencesPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
