import type { Collection, Snowflake } from "discord.js";
import type Player from "../classes/Player";

import type {
    BooleanString,
    IncorrectAnswers,
    QuestionDifficultyType
} from "open-trivia-db";

/**
 * Represents a developer-made question.
 */
export type CustomQuestion<T extends "multiple" | "boolean"> = {
    /**
     * This question's category.
     */
    category: string;

    /**
     * The type of question this is (multiple choice or true/false).
     * @type {"multiple" | "boolean"}
     */
    type: T;

    /**
     * The difficulty of this question.
     * @type {QuestionDifficultyType}
     */
    difficulty: QuestionDifficultyType;

    /**
     * The question itself.
     */
    value: string;

    /**
     * This question's correct answer.
     */
    correctAnswer: string | BooleanString;

    /**
     * This question's incorrect options.
     */
    incorrectAnswers: T extends "multiple" ? IncorrectAnswers : BooleanString;
};

/**
 * Represents a game's leaderboard.
 */
export type Leaderboard = Collection<Snowflake, Player>;

/**
 * The amount of time in milliseconds to wait before deleting the respective message.
 * @type {number | null}
 */
export type MessageDeleterConfig = number | null;
