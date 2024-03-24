import type { ButtonBuilder, Collection, EmbedBuilder, User } from "discord.js";
import { CustomQuestion, Leaderboard, MessageDeleterConfig } from "./types";
import Player from "../classes/Player";
import {
    BooleanString,
    CategoryNameType,
    IncorrectAnswers,
    QuestionDifficulties,
    QuestionDifficultyType,
    QuestionTypeType,
    QuestionTypes
} from "open-trivia-db";
import {
    BooleanQuestion,
    MultipleChoiceQuestion
} from "../classes/CustomQuestionBuilder";

/**
 * A trivia game's configuration.
 */
export interface GameConfig {
    /**
     * A trivia game's buttons.
     */
    buttons: GameButtons;

    /**
     * A trivia game's embeds.
     */
    embeds: GameEmbeds;

    /**
     * This game's fetched questions from Open Trivia DB.
     */
    fetchQuestionsOptions: GameQuestionOptions;

    /**
     * This game's custom questions.
     */
    customQuestions: (
        | CustomQuestion<QuestionTypes>
        | MultipleChoiceQuestion
        | BooleanQuestion
    )[];

    /**
     * Whether to show the correct answer at the end of a round.
     */
    showAnswers: boolean;

    /**
     * Configuration for message auto-deleters.
     */
    messageDeleter: GameMessageData;

    /**
     * A function which evaluates a user. If the function returns `false`, the user is not admitted into the game.
     * @param {User} user The user to evaluate.
     * @returns {(user: User) => (boolean | Promise<boolean>) | null}
     */
    playerFilter: ((user: User) => boolean | Promise<boolean>) | null;

    /**
     * How long in milliseconds to keep the queue open.
     */
    queueDuration: number;

    /**
     * How long in milliseconds to wait between rounds
     */
    timeBetweenRounds: number;

    /**
     * How long in milliseconds to wait between questions.
     */
    timeBetweenQuestions: number;

    /**
     * How long in milliseconds to wait during each question.
     */
    timePerQuestion: number;

    /**
     * The minimum amount of points a player can earn off a quesion.
     */
    minPoints: number;

    /**
     * The minimum amount of players required to start a game.
     */
    minPlayerCount: number;

    /**
     * The maximum amount of players allowed in a game.
     */
    maxPlayerCount: number;

    /**
     * The maximum amount of points a player can earn off a quesion.
     */
    maxPoints: number;

    /**
     * The amount of correct answers in a row needed to be considered on a streak.
     */
    streakDefinitionLevel: number;

    /**
     * The amount of bonus points *per* correct question *after* a streak has started.
     */
    pointsPerStreakAmount: number;

    /**
     * The maximum amount of bonus points a player can earn off a single question.
     */
    maximumStreakBonus: number;
}

/**
 * A trivia game's buttons.
 */
export interface GameButtons {
    join: ButtonBuilder;
    questionOptionA: ButtonBuilder;
    questionOptionB: ButtonBuilder;
    questionOptionC: ButtonBuilder;
    questionOptionD: ButtonBuilder;
    questionOptionTrue: ButtonBuilder;
    questionOptionFalse: ButtonBuilder;
}

/**
 * A trivia game's embeds.
 */
export interface GameEmbeds {
    queue: (players?: Player[]) => EmbedBuilder;
    gameStart: () => EmbedBuilder;
    playerJoin: (player: Player) => EmbedBuilder;
    gameQueueTimeout: () => EmbedBuilder;
    question: (question: GameQuestion) => EmbedBuilder;
    leaderboardUpdate: (
        leaderboard: Collection<string, Player>,
        lastQuestion: GameQuestion
    ) => EmbedBuilder;

    playerNotInMatch: (user: User) => EmbedBuilder;
    playerAlreadyAnswered: (player: Player) => EmbedBuilder;
    playerAnsweredStats: (player: Player, timeElapsed: number) => EmbedBuilder;
    playerAlreadyQueued: (player: Player) => EmbedBuilder;

    filterReject: (user: User) => EmbedBuilder;
    gameEnd: (leaderboard: Collection<string, Player>) => EmbedBuilder;
}

/**
 * Represents a game's data.
 */
export interface GameData {
    /**
     * This game's questions to use.
     */
    questions: GameQuestion[];

    /**
     * The date timestamp of when this game ended.
     */
    timeEnd: number | null;

    /**
     * The players participating in this game.
     */
    players: Leaderboard;
}

export interface GameQuestionOptions extends Record<string, any> {
    /**
     * The amount of API questions to fetch.
     */
    amount: number;

    /**
     * The category of questions to fetch.
     */
    category?: CategoryNameType | number;

    /**
     * The difficulty of questions to fetch.
     */
    difficulty?: QuestionDifficultyType | QuestionDifficulties;

    /**
     * The type of questions to fetch.
     */
    type?: QuestionTypeType;
}

/**
 * Allocated messages to be referenced by a `Game`.
 */
export interface GameMessageData {
    /**
     * The queue message.
     * @type {MessageDeleterConfig} The auto deletion configuration.
     */
    queue: MessageDeleterConfig;

    /**
     * The game starting anouncement message.
     * @type {MessageDeleterConfig} The auto deletion configuration.
     */
    gameStart: MessageDeleterConfig;

    /**
     * A question message.
     * @type {MessageDeleterConfig} The auto deletion configuration.
     */
    question: MessageDeleterConfig;

    /**
     * A leaderboard message shown between rounds.
     * @type {MessageDeleterConfig} The auto deletion configuration.
     */
    leaderboardUpdate: MessageDeleterConfig;
}

/**
 * The options for a game's question configuration.
 */
export interface GameQuestionOptions {
    /**
     * The amount of API questions to fetch.
     */
    amount: number;

    /**
     * The category of questions to fetch.
     */
    category?: CategoryNameType | number;

    /**
     * The difficulty of questions to fetch.
     */
    difficulty?: QuestionDifficultyType | QuestionDifficulties;

    /**
     * The type of questions to fetch.
     */
    type?: QuestionTypeType;
}

/**
 * Represents a trivia question.
 */
export interface GameQuestion {
    /**
     * The question itself.
     */
    value: string;

    /**
     * This question's category.
     */
    category: string;

    /**
     * This question's difficulty level.
     */
    difficulty: QuestionDifficultyType;

    /**
     * This question's type.
     */
    type: QuestionTypes;

    /**
     * This question's correct answer
     */
    correctAnswer: string;

    /**
     * This question's incorrect answer(s)
     */
    incorrectAnswers: IncorrectAnswers | BooleanString;

    /**
     * All answer choices
     */
    allAnswers: string[];

    /**
     * Checks if the given string equals this question's correct answer.
     * @param {string} str
     * @returns {boolean}
     */
    checkAnswer: (str: string) => boolean;
}
