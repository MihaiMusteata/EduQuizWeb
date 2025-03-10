import type { Flashcard } from "src/types/flashcard";

import { z as zod } from "zod";

export type FieldsSchemaType = {
  flashcard: Flashcard;
};

export const FieldsSchema = zod.object({
  flashcard: zod.object({
    frontSideText: zod.string(),
    backSideText: zod.string(),
    hint: zod.string().optional(),
  }),
});
