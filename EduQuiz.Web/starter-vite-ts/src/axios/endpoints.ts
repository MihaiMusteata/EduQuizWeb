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
    totalQuestions: (id: string) => `/quiz/${id}/total-questions`,
    submit: (id: string) => `/quiz/${id}/submit`,
    generate: '/ai/quiz/generate',
  },
  quizSession: {
    get: (id: string) => `/quiz-session/${id}`,
    create: '/quiz-session/create',
    start: (id: string) => `/quiz-session/${id}/start`,
    getQuestion: (id: string, nickname: string, index: number) => `/quiz-session/${id}/question?nickname=${nickname}&index=${index}`,
    submitAnswer: (id: string) => `/quiz-session/${id}/submit-answer`,
    getResult: (id: string, nickname: string) => `/quiz-session/${id}/result?nickname=${nickname}`,
    end: (id: string) => `/quiz-session/${id}/end`,
  },
  question: {
    getByIndex: '/question/by-index',
    getList: '/question/list',
    create: (quizId: string) => `/question/create?quizId=${quizId}`,
    update: '/question/update',
    delete: (id: string) => `/question/${id}`,
  },
  flashcardDeck: {
    create: '/flashcard-deck/create',
    get: (id: string) => `/flashcard-deck/${id}`,
    update: '/flashcard-deck/update',
    delete: (id: string) => `/flashcard-deck/${id}`,
    generate: '/ai/flashcard/generate',
  },
  flashcard: {
    create: (deckId: string) => `/flashcard/create?flashcardDeckId=${deckId}`,
    update: '/flashcard/update',
    delete: (id: string) => `/flashcard/${id}`,
  },
  library: {
    get: '/library/my-library',
  },
  exportImport: {
    export: '/export-import/export',
    import: '/export-import/import',
  }
}
