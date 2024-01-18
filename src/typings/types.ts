import { Collection, Snowflake } from "discord.js";
import { BooleanString, IncorrectAnswers, QuestionDifficultyType } from "open-trivia-db";

import Player from "../classes/Player";

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

  /**
 * Represents a game's leaderboard.
 */
export type Leaderboard = Collection<Snowflake, Player>;