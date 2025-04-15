// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  ACTIVITY: '/activity',
};

// ----------------------------------------------------------------------

export const paths = {
  faqs: '/faqs',
  page403: '/error/403',
  page404: '/error/404',
  page500: '/error/500',
  // AUTH
  auth: {
    jwt: {
      signIn: `${ROOTS.AUTH}/sign-in`,
      signUp: `${ROOTS.AUTH}/sign-up`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    tools: `${ROOTS.DASHBOARD}/tools`,
    library: `${ROOTS.DASHBOARD}/library`,
  },

  // ACTIVITY
  activity: {
    create: `${ROOTS.ACTIVITY}/create`,
    generate: `${ROOTS.ACTIVITY}/generate`,
    importExport: (id?: string) => `${ROOTS.ACTIVITY}/import-export${id ? `?id=${id}` : ''}`,
    quiz: {
      new: `${ROOTS.ACTIVITY}/quiz/new`,
      edit: (id: string) => `${ROOTS.ACTIVITY}/quiz/edit/${id}`,
      practice: (id: string) => `${ROOTS.ACTIVITY}/quiz/practice/${id}`,
    },
    flashcardDeck: {
      new: `${ROOTS.ACTIVITY}/flashcard-deck/new`,
      edit: (id: string) => `${ROOTS.ACTIVITY}/flashcard-deck/edit/${id}`,
      practice: (id: string) => `${ROOTS.ACTIVITY}/flashcard-deck/practice/${id}`,
    },
  },

  // QUIZ SESSION
  session: {
    host: (id: string) => `/host/${id}`,
    join: `/join`,
  },
};
