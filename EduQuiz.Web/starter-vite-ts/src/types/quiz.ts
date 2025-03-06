export type Answer = {
  text: string;
  isCorrect: boolean;
};

export type Question = {
  text: string;
  type: QuestionType | undefined;
  hint?: string;
  answers: Answer[];
};

export type Quiz = {
  title: string;
  visibility: Visibility;
  questions: Question[];
};

export type GeneralQuiz = {
  id: string;
  title: string;
  visibility: Visibility;
  createdAt: string;
  totalQuestions: number;
};

export type QuestionType = 'true/false' | 'multiple-choice' | 'single-choice' | 'short-answer' ;
export type Visibility = 'public' | 'private';
