export type Answer = {
  text: string;
  isCorrect: boolean;
};

export type Question = {
  text: string;
  type: 'true/false' | 'multiple-choice' | 'single-choice' | 'short-answer';
  hint?: string;
  answers: Answer[];
};

export type Quiz = {
  title: string;
  visibility: 'public' | 'private';
  questions: Question[];
};
