import { BooleanString, IncorrectAnswers, QuestionDifficultyType } from "open-trivia-db";

export type MessageDeleterConfig = number | null;

/**
 * Represents a developer-made question.
 */
export type CustomQuestion<T extends "multiple" | "boolean"> = {
    category: string;
    type: T;
    difficulty: QuestionDifficultyType;
    value: string;
    correctAnswer: string | BooleanString;
    incorrectAnswers: T extends "multiple" ? IncorrectAnswers : BooleanString;
  };