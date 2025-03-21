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
  userAnswer: string;
};

export type SubmissionResponse = {
  finalGrade: number;
  questions: Question[];
}

export type QuestionType = 'true/false' | 'multiple-choice' | 'single-choice' | 'short-answer' | undefined;
export type Visibility = 'public' | 'private';
