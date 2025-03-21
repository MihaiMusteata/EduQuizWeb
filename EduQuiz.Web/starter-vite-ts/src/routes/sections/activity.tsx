import type { RouteObject } from 'react-router';

import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { LoadingScreen } from 'src/components/loading-screen';

import { ActivityCreateDialog } from 'src/sections/acitvity/view/activity-create-dialog';

import { AuthGuard } from 'src/auth/guard';


// ----------------------------------------------------------------------
// Quiz
const QuizCreatePage = lazy(() => import('src/pages/dashboard/quiz/new'));
const QuizEditPage = lazy(() => import('src/pages/dashboard/quiz/edit'));
const QuizPracticePage = lazy(() => import('src/pages/dashboard/quiz/practice'));

//Flashcard Deck
const FlashcardDeckCreatePage = lazy(() => import('src/pages/dashboard/flashcard-deck/new'));
const FlashcardDeckEditPage = lazy(() => import('src/pages/dashboard/flashcard-deck/edit'));
// ----------------------------------------------------------------------

export const activityRoutes: RouteObject[] = [
  {
    path: 'activity',
    element: (
      <AuthGuard>
        <Suspense fallback={<LoadingScreen />}>
          <Outlet />
        </Suspense>
      </AuthGuard>
    ),
    children: [
      { path: 'create', element: <ActivityCreateDialog /> },
      {
        path: 'quiz',
        children: [
          { path: 'new', element: <QuizCreatePage /> },
          { path: 'edit/:id', element: <QuizEditPage /> },
          { path: 'practice/:id', element: <QuizPracticePage /> }
        ]
      },
      {
        path: 'flashcard-deck',
        children: [
          { path: 'new', element: <FlashcardDeckCreatePage /> },
          { path: 'edit/:id', element: <FlashcardDeckEditPage /> }
        ]
      },
    ]
  }
];
