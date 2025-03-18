import type { Visibility } from "./quiz";

export type FlashcardDeck = {
  id?: string;
  title: string;
  visibility: Visibility;
  flashcards: Flashcard[];
}

export type Flashcard = {
  id?: string;
  frontSideText: string;
  backSideText: string;
  hint?: string;
}
