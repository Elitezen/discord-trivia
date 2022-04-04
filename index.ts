// import CanvasGenerator from "./src/Classes/CanvasGenerator";
import { getQuestions } from "easy-trivia";
import DiscordTriviaError from "./src/Classes/DiscordTriviaError";
import EmbedGenerator from "./src/Classes/EmbedGenerator";
// import TriviaCommandBuilder from "./src/Classes/TriviaCommandBuilder";
import TriviaGame from "./src/Classes/TriviaGame";
import TriviaManager from "./src/Classes/TriviaManager";

import {
  CanvasGeneratorOptions,
  DiscordTriviaErrorMessages,
  LockedGameOptionsEntry,
  TriviaCommandBuilderOptions,
  TriviaGameData,
  TriviaManagerOptions,
  TriviaPlayer,
  TriviaGameOptions
} from './src/Typings/interfaces';

import {
  TriviaManagerGames,
  TriviaPlayers,
  TriviaGameState,
  TriviaCommandBuilderType,
  TriviaGameOptionKeys,
  LockedOptionApplier
} from './src/Typings/types';

export {
  // CanvasGenerator,
  DiscordTriviaError,
  EmbedGenerator,
  // TriviaCommandBuilder,
  TriviaGame,
  TriviaManager,
  CanvasGeneratorOptions,
  DiscordTriviaErrorMessages,
  LockedGameOptionsEntry,
  TriviaCommandBuilderOptions,
  TriviaGameData,
  TriviaManagerOptions,
  TriviaPlayer,
  TriviaGameOptions,
  TriviaManagerGames,
  TriviaPlayers,
  TriviaGameState,
  TriviaCommandBuilderType,
  TriviaGameOptionKeys,
  LockedOptionApplier,
}

// T/F always incorrect
// Streaks max to 30