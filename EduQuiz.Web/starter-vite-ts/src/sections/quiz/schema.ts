import { z as zod } from "zod";

import type { Question } from "../../types/quiz";

export type FieldsSchemaType = {
  question: Question;
};

export const FieldsSchema = zod.object({
  question: zod.object({
    id: zod.string().optional(),
    text: zod.string(),
    type: zod.enum(['true/false', 'multiple-choice', 'single-choice', 'short-answer']).optional(),
    answers: zod.array(zod.object({
      id: zod.string().optional(),
      text: zod.string().optional(),
      isCorrect: zod.boolean().optional(),
    })).optional(),
    hint: zod.string().optional(),
  }),
});
