import { ButtonStyle, GuildMember, ColorResolvable, User } from "discord.js";
import {
  BooleanString,
  CategoryNameType,
  IncorrectAnswers,
  QuestionDifficulties,
  QuestionDifficultyType,
  QuestionTypes,
  QuestionTypeType,
} from "open-trivia-db";
import TriviaGame from "../Classes/TriviaGame";
import { Leaderboard } from "./types";

/**
 * Decoration options for embeds and buttons.
 */
export interface DecorationOptions {
  /**
   * The button style for each message.
   */
  buttonStyle: ButtonStyle;

  /**
   * The color for every embed.
   */
  embedColor: ColorResolvable;

  /**
   * The embed for select embeds
   */
  embedImage: string;

  /**
   * The thumbnail for every embed.
   */
  embedThumbnail: string;
}

/**
 * The options for a game's configuration.
 */
export interface GameOptions {
  /**
   * The duration for the queue.
   */
  queueTime: number;

  /**
   * The maximum number of players that can join a game.
   */
  maxPlayerCount: number;

  /**
   * The maximum number of points a player can earn for a question.
   */
  maxPoints: number;

  /**
   * The minimum number of required players for a game to start.
   */
  minPlayerCount: number;

  /**
   * The minimum number of points a player can earn for a question.
   */
  minPoints: number;

  /**
   * The duration in ms for round intermissions.
   */
  timeBetweenRounds: number;

  /**
   * The duration in ms for each question.
   */
  timePerQuestion: number;

  /**
   * The number of correct answers in a row required for the player to be defined as on a streak.
   */
  streakDefinitionLevel: number;

  /**
   * This, multiplied by the player's streak amount will be the streak bonus per correct question.
   */
  pointsPerSteakAmount: number;

  /**
   * The maximum streak bonus a player can earn.
   */
  maximumStreakBonus: number;

  /**
   * Whether to reveal the correct answer at the end of a round.
   */
  showAnswers: boolean;
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
   * The trivia category of this game.
   */
  category: CategoryNameType | number | null;

  /**
   * This game's difficulty.
   */
  difficulty: QuestionDifficultyType | null;

  /**
   * The date timestamp of when this game ended.
   */
  timeEnd: number | null;

  /**
   * The players participating in this game.
   */
  players: Leaderboard;
}

/**
 * The options for a game's question configuration.
 */
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

/**
 * Represents a player's data.
 */
export interface Player {
  /**
   * This player's points.
   */
  points: number;

  /**
   * Whether this player has answered in the current round.
   */
  hasAnswered: boolean;

  /**
   * Whether this player got the current question correct.
   */
  isCorrect: boolean;

  /**
   * This player's streak, if any.
   */
  correctAnswerStreak: number;

  /**
   * The game this player belongs to.
   */
  game: TriviaGame;

  /**
   * The player's `GuildMember` object.
   */
  member: GuildMember;
}

/**
 * A record of a game's text outputting.
 */
export interface TextOutputs
  extends Record<string, (...args: any[]) => string | string> {
  /**
   * Sent whenever a player tries to join a game they are already queued for.
   * @param {User} user The player's `User` object.
   * @returns {string} The string to send.
   */
  alreadyQueued: (user: User) => string;

  /**
   * Sent whenever the next question is inbound.
   * @returns {string} The string to send.
   */
  preparingQuestion: () => string;

  /**
   * Sent whenever a user answers a question to a game they are not a part of.
   * @returns {string} The string to send.
   */
  notInMatch: () => string;

  /**
   * Sent whenever a player tries to answer a question they have already answered.
   * @param {User} user The player's `User` object.
   * @returns {string} The string to send.
   */
  alreadyChoseAnswer: (user: User) => string;

  /**
   * Emphemeral message sent whenever a player locks in an answer.
   * @param {User} user The player's `User` object.
   * @param {number} timeElapsed the time in ms since the question's emission.
   * @returns {string} The string to send.
   */
  answerLockedInPrivate: (user: User, timeElapsed: number) => string;

  /**
   * Sent when a queue failed to meet requirements to start.
   * @returns {string} The string to send.
   */
  gameFailedRequirements: () => string;

  /**
   * Sent whenever a player has joined a game.
   * @returns {string} The string to send.
   */
  memberJoinedGamePrivate: () => string;
}
