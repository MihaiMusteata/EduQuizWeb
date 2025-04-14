export type Answer = {
  id?: string;
  text: string;
  isCorrect: boolean;
};

export type Question = {
  id?: string;
  text: string;
  type: QuestionType | undefined;
  hint?: string;
  answers: Answer[];
};

export type Quiz = {
  id?: string;
  title: string;
  visibility: Visibility;
  questions: Question[];
};

export type AnswerGiven = {
  questionId: string;
  userAnswer?: string;
  selectedIds?: string[];
};

export type QuizResult = {
  finalScore: number;
  questions: Question[];
}

export type QuestionType = 'true-false' | 'multiple-choice' | 'single-choice' | 'short-answer' | undefined;
export type Visibility = 'public' | 'private';

export type AIConfigParams = {
  subject: string;
  topic: string;
  language: string;
  numQuestions: string;
}

export type QuizSession = {
    id: string;
    quizId?: string;
    accessPin?: string;
    status: QuizSessionStatus;
    startTime?: string;
    endTime?: string;
    totalQuestions: number;
    // participants: Participant[];
    // currentQuestionId?: number;
}

export type QuizSessionStatus = "waiting" | "running" | "finished";
