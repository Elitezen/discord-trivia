import { Collection, Snowflake } from "discord.js";
import TriviaGame from "../Classes/TriviaGame";
import {
  TriviaCommandBuilderConfigEntry,
  TriviaGameOptions,
  TriviaPlayer,
} from "./interfaces";

export type TriviaManagerGames = Collection<Snowflake, TriviaGame>;
export type TriviaPlayers = Collection<Snowflake, TriviaPlayer>;
export type TriviaGameState = "PENDING" | "QUEUE" | "IN_PROGRESS" | "ENDED";
export type TriviaCommandBuilderType = "BUILDER" | "JSON";
export type TriviaGameOptionKeys = keyof TriviaGameOptions;
export type TriviaCommandBuilderConfig = TriviaCommandBuilderConfigEntry[];
