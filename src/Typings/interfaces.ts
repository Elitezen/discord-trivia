import {
  Collection,
  ColorResolvable,
  GuildMember,
  Snowflake,
} from "discord.js";
import {
  TriviaCategoryName,
  TriviaQuestionDifficulty,
  TriviaQuestionType,
} from "easy-trivia";

export interface CanvasGeneratorOptions {
  font: string;
}

export interface DiscordTriviaErrorMessages {
  [key: string]: {
    message: string;
    header: string;
  };
}

export interface TriviaGameData {
  hostMember: GuildMember;
  players: Collection<Snowflake, TriviaPlayer>;
}

export interface TriviaGameOptions {
  minPlayerCount?: number;
  maxPlayerCount?: number;
  timePerQuestion?: number;
  triviaCategory?: TriviaCategoryName | null;
  questionAmount?: number;
  questionDifficulty?: TriviaQuestionDifficulty | null;
  questionType?: TriviaQuestionType | null;
  queueTime?: number;
}

export interface TriviaGameOptionsStrict {
  minPlayerCount: number;
  maxPlayerCount: number;
  timePerQuestion: number;
  triviaCategory: TriviaCategoryName | null;
  questionAmount: number;
  questionDifficulty: TriviaQuestionDifficulty | null;
  questionType: TriviaQuestionType | null;
  queueTime: number;
}

export interface TriviaManagerOptions {
  theme: ColorResolvable;
}

export interface TriviaPlayer extends GuildMember {
  points: number;
  hasAnswered: boolean;
  isCorrect: boolean;
  leaderboardPosition: {
    previous: number;
    current: number;
  };
}
