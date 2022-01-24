import {
  Collection,
  ColorResolvable,
  GuildMember,
  MessageButtonStyle,
  Snowflake,
} from "discord.js";
import {
  TriviaCategoryName,
  TriviaQuestionDifficulty,
  TriviaQuestionType,
} from "easy-trivia";

export interface TriviaGameData {
  hostMember: GuildMember;
  players: Collection<Snowflake, TriviaPlayer>;
}

export interface TriviaGameMessages {
  playerJoinedQueue?: string; //This is the message that everyone sees
  alreadyJoined?: string; //Already joined message
  // gameEmbed: MessageEmbed; //Start embed
  // gameEmbedReady: MessageEmbed; //Start embed edited
  // startMessage?: string; //Started game ephemeral message
  // joinedQueue?: string; //This message is ephemeral
  // joinButton?: MessageButton; //Join button to join game uses `.setDisabled()` to disable it
  // baseLeaderboardEmbed: MessageEmbed; //Base leaderboard embed set color, title, description
  // baseQuestionEmbed: MessageEmbed; //Question embed you can set the color here
  // correctEmbed: MessageEmbed; //If correct answer use this
  // incorrectEmbed: MessageEmbed; //Else this
  // startButton: MessageButton; //Starts the game button
}

export interface TriviaGameMessagesFinal {
  playerJoinedQueue: string;
  alreadyJoined: string;
}

export interface TriviaGameOptions {
  minPlayerCount?: number;
  maxPlayerCount?: number;
  timePerQuestion?: number;
  triviaCategory?: TriviaCategoryName;
  questionAmount?: number;
  questionDifficulty?: TriviaQuestionDifficulty;
  questionType?: TriviaQuestionType;
  queueTime?: number;
  // gameMessages: TriviaGameMessages;
}

export interface TriviaGameOptionsFinal {
  minPlayerCount: number;
  maxPlayerCount: number;
  timePerQuestion: number;
  triviaCategory: TriviaCategoryName;
  questionAmount: number;
  questionDifficulty: TriviaQuestionDifficulty;
  questionType: TriviaQuestionType;
  queueTime: number;
}

export interface TriviaManagerOptions {
  theme?: ColorResolvable;
  messages?: TriviaGameMessages;
}

export interface TriviaManagerOptionsFinal {
  theme: ColorResolvable;
  messages: TriviaGameMessagesFinal;
}

export interface TriviaPlayer {
  member: GuildMember;
  points: number;
  hasAnswered: boolean;
  isCorrect: boolean;
  leaderboardPosition: {
    previous: number;
    current: number;
  };
}

export interface VerifyButtonOptions {
  disabled?: boolean;
  style?: MessageButtonStyle;
  noLink?: boolean;
  customId?: string | null;
}
