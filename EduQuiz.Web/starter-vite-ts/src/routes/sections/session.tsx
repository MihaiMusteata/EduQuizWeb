import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';

import { SimpleLayout } from 'src/layouts/simple';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';

const QuizSessionPage = lazy(() => import('src/pages/dashboard/quiz-session/session'));
const QuizSessionHostPage = lazy(() => import('src/pages/dashboard/quiz-session/host'));
export const sessionRoutes: RouteObject[] = [
  {
    path: 'join',
    element: (
      <SimpleLayout>
        <Suspense fallback={<LoadingScreen />}>
          <QuizSessionPage />
        </Suspense>
      </SimpleLayout>
    ),
  },
  {
    path: 'host/:id',
    element: (
      <AuthGuard>
        <SimpleLayout>
          <Suspense fallback={<LoadingScreen />}>
            <QuizSessionHostPage />
          </Suspense>
        </SimpleLayout>
      </AuthGuard>
    ),
  }
];
