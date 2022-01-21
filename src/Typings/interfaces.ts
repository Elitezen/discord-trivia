import { Collection, GuildMember, MessageButton, MessageButtonStyle, MessageEmbed, Snowflake } from "discord.js";
import { TriviaCategoryName, TriviaQuestionDifficulty, TriviaQuestionType } from "easy-trivia";

export interface TriviaGameData {
  hostMember: GuildMember;
  players: Collection<Snowflake, TriviaPlayer>;
}

// null = any or not specified

export interface TriviaGameOptions {
  minPlayerCount?: number;
  maxPlayerCount?: number;
  timePerQuestion?: number;
  triviaCategory?: TriviaCategoryName | null;
  questionAmount?: number;
  questionDifficulty?: TriviaQuestionDifficulty | null;
  questionType?: TriviaQuestionType | null;
  queueTime?: number;
  gameMessages?: TriviaGameMessages
}

export interface TriviaGameMessages {
  playerJoinedQueue: string; //This is the message that everyone sees
  gameEmbed: MessageEmbed;
  alreadyJoined: string;
  gameEmbedStart: MessageEmbed;
  startMessage: string;
  joinedQueue: string; //This message is ephemeral
  joinButton: MessageButton;
  baseLeaderboardEmbed: MessageEmbed;
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
  gameMessages: TriviaGameMessages
}

export interface TriviaManagerOptions {
  
}

export interface TriviaPlayer {
  member: GuildMember;
  points: number;
}

export interface VerifyButtonOptions {
  disabled?: boolean;
  style?: MessageButtonStyle;
  noLink?: boolean;
  customId?: string | null;
}