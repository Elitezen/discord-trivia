import {
  Collection,
  ColorResolvable,
  GuildMember,
  Snowflake,
} from "discord.js";
import {
  CategoryName,
  CategoryResolvable,
  Question,
  QuestionDifficulty,
  QuestionType,
} from "open-trivia-db";
import { TriviaGameOptionKeys } from "./types";

export interface CanvasGeneratorOptions {
  font: string;
}

export interface CustomQuestion {
  value: string;
  category?: CategoryName<"Pretty">;
  difficulty?: QuestionDifficulty;
  correctAnswer: string;
  incorrectAnswers: [string, string, string] | [`${boolean}`];
}

export interface DiscordTriviaErrorMessages {
  [key: string]: {
    message: string;
    header: string;
  };
}

export interface LockedGameOptionsEntry {
  optionName: TriviaGameOptionKeys;
  value: string | number | null;
}

export interface TriviaCommandBuilderOptions {
  name: string;
  description: string;
}

export interface TriviaGameData {
  hostMember: GuildMember;
  players: Collection<Snowflake, TriviaPlayer>;
}

export interface ResultPlayerData {
  id: Snowflake;
  points: number;
}

export interface TriviaGameResultData {
  gameConfiguration: TriviaGameOptions;
  hostMemberId: Snowflake;
  players: ResultPlayerData[];
}

export interface TriviaGameOptions {
  questionData: QuestionData | CustomQuestion[];
  minimumPlayerCount: number;
  maximumPlayerCount: number;
  timePerQuestion: number;
  queueTime: number;
  minimumPoints: number;
  maximumPoints: number;
  pointsPerStreakAmount: number;
  maximumStreakBonus: number;
  streakDefinitionLevel: number;
  timeBetweenRounds: number;
}

export interface TriviaManagerOptions {
  theme?: ColorResolvable;
  showAnswers?: boolean;
  image?: string;
}

export interface TriviaPlayer extends GuildMember {
  points: number;
  hasAnswered: boolean;
  isCorrect: boolean;
  correctAnswerStreak: number;
}

export interface QuestionData {
  category: CategoryResolvable | null;
  amount: number;
  difficulty: QuestionDifficulty | null;
  type: QuestionType | null;
  customQuestions?: CustomQuestion[];
}
