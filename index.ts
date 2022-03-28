import CanvasGenerator from "./src/Classes/CanvasGenerator";
import DiscordTriviaError from "./src/Classes/DiscordTriviaError";
import EmbedGenerator from "./src/Classes/EmbedGenerator";
import TriviaCommandBuilder from "./src/Classes/TriviaCommandBuilder";
import TriviaGame from "./src/Classes/TriviaGame";
import TriviaManager from "./src/Classes/TriviaManager";

// import * as EasyTrivia from 'easy-trivia';

// const {
//   Category, 
//   EasyTriviaError, 
//   OpenTDBResponse, 
//   EasyTriviaUtil, 
//   Session, 
//   Validator, 
//   getCategoryData, 
//   getQuestions,
//   CategoryNamesStrict, 
//   CategoryNameVersions, 
//   CategoryNamesPretty, 
//   QuestionAmountRange, 
//   QuestionDifficulties, 
//   QuestionEncodings, 
//   QuestionTypes,
//   QuestionVersions
// } = EasyTrivia;

// import {
//   CategoryIdResolvable, 
//   CategoryNameResolvable, 
//   CategoryName, 
//   CategoryNameVersion, 
//   CategoryNamePretty, 
//   CategoryNameStrict, 
//   CategoryResolvable, 
//   CategoryResolvableType, 
//   NumberResolvable, 
//   OpenTDBResponseCode, 
//   QuestionDifficulty, 
//   QuestionOptionsDefaults, 
//   QuestionType, 
//   QuestionEncoding, 
//   QuestionVersion, 
//   Questions, 
//   OpenTDBResponseDefault, 
//   OpenTDBResponseSession, 
//   RawCategoryData, 
//   CategoryData, 
//   OpenTDBResponseCategoryData, 
//   Question, 
//   QuestionBase, 
//   QuestionOptions, 
//   RawQuestion
// } from 'easy-trivia';

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

  CanvasGenerator,
  DiscordTriviaError,
  EmbedGenerator,
  TriviaCommandBuilder,
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

  // Easy Trivia Exports
  // Category, 
  // EasyTriviaError, 
  // OpenTDBResponse, 
  // EasyTriviaUtil, 
  // Session, 
  // Validator, 
  // getCategoryData, 
  // getQuestions,
  // CategoryNamesStrict, 
  // CategoryNameVersions, 
  // CategoryNamesPretty, 
  // QuestionAmountRange, 
  // QuestionDifficulties, 
  // QuestionEncodings, 
  // QuestionTypes,
  // QuestionVersions,
  // CategoryIdResolvable, 
  // CategoryNameResolvable, 
  // CategoryName, 
  // CategoryNameVersion, 
  // CategoryNamePretty, 
  // CategoryNameStrict, 
  // CategoryResolvable, 
  // CategoryResolvableType, 
  // NumberResolvable, 
  // OpenTDBResponseCode, 
  // QuestionDifficulty, 
  // QuestionOptionsDefaults, 
  // QuestionType, 
  // QuestionEncoding, 
  // QuestionVersion, 
  // Questions, 
  // OpenTDBResponseDefault, 
  // OpenTDBResponseSession, 
  // RawCategoryData, 
  // CategoryData, 
  // OpenTDBResponseCategoryData, 
  // Question, 
  // QuestionBase, 
  // QuestionOptions, 
  // RawQuestion
}