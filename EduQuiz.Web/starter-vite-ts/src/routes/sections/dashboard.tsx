import type { RouteObject } from 'react-router';

import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { CONFIG } from 'src/global-config';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { ActivityCreateDialog } from 'src/sections/acitvity/view/activity-create-dialog';

import { AuthGuard } from 'src/auth/guard';

import { usePathname } from '../hooks';

// ----------------------------------------------------------------------

const IndexPage = lazy(() => import('src/pages/dashboard/one'));
const ToolsPage = lazy(() => import('src/pages/dashboard/tools'));
const LibraryPage = lazy(() => import('src/pages/dashboard/library'));
// Quiz
const QuizCreatePage = lazy(() => import('src/pages/dashboard/quiz/new'));
const QuizEditPage = lazy(() => import('src/pages/dashboard/quiz/edit'));

// ----------------------------------------------------------------------

function SuspenseOutlet() {
  const pathname = usePathname();
  return (
    <Suspense key={pathname} fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  );
}

const dashboardLayout = () => (
  <DashboardLayout>
    <SuspenseOutlet />
  </DashboardLayout>
);

export const dashboardRoutes: RouteObject[] = [
  {
    path: 'dashboard',
    element: CONFIG.auth.skip ? dashboardLayout() : <AuthGuard>{dashboardLayout()}</AuthGuard>,
    children: [
      { element: <IndexPage />, index: true },
      { path: 'tools', element: <ToolsPage /> },
      { path: 'library', element: <LibraryPage /> },
      {
        path: 'activity',
        children: [
          { path: 'create', element: <ActivityCreateDialog /> },
          {
            path: 'quiz',
            children: [
              { path: 'new', element: <QuizCreatePage /> },
              { path: 'edit/:id', element: <QuizEditPage /> }
            ]
          }
        ],
      },
    ]
  },
];
