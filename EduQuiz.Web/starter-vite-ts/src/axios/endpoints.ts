export const endpoints = {
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
    refresh: '/auth/refresh-token',
  },
  quiz: {
    get: (id: number | string) => `/quiz/${id}`,
    create: '/quiz/create',
    update: '/quiz/update',
    delete: (id: number | string) => `/quiz/delete/${id}`,
  },
  question: {
    update: '/question/update',
    delete: (id: number | string) => `/question/delete/${id}`,
  },
  answer: {
    update: '/answer/update',
    delete: (id: number | string) => `/answer/delete/${id}`,
  },
  flashcardDeck: {
    create: '/flashcard-deck/create',
  },
  library: {
    get: '/library/my-library',
  }
}
