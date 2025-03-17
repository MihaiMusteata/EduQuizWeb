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
    quiz: {
      new: `${ROOTS.ACTIVITY}/quiz/new`,
      edit: (id: string) => `${ROOTS.ACTIVITY}/quiz/edit/${id}`,
    }
  }
};
