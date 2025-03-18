export const endpoints = {
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
    refresh: '/auth/refresh-token',
  },
  quiz: {
    get: (id: string) => `/quiz/${id}`,
    create: '/quiz/create',
    update: '/quiz/update',
    delete: (id: string) => `/quiz/${id}`,
  },
  flashcardDeck: {
    create: '/flashcard-deck/create',
    get: (id: string) => `/flashcard-deck/${id}`,
    update: '/flashcard-deck/update',
    delete: (id: string) => `/flashcard-deck/${id}`,
  },
  library: {
    get: '/library/my-library',
  }
}
