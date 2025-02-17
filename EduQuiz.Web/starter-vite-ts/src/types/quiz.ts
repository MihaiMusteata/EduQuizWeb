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
  visibility: 'public' | 'private';
  questions: Question[];
};

export type QuestionType = 'true/false' | 'multiple-choice' | 'single-choice' | 'short-answer' ;
