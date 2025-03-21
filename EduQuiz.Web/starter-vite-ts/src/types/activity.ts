export type PracticeMode = 'singleplayer' | 'multiplayer';
export type PracticeConfig = {
  timer?: number;
  withTimer: boolean;
  numberOfQuestions: "all" | "one";
  shuffleQuestions: boolean;
  shuffleAnswers: boolean;
};
