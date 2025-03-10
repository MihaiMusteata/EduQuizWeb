import type { Visibility } from "./quiz";

export type FlashcardDeck = {
  title: string;
  visibility: Visibility;
  flashcards: Flashcard[];
}

export type Flashcard = {
  frontSideText: string;
  backSideText: string;
  hint?: string;
}
