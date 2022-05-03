import { Collection, Snowflake } from "discord.js";
import TriviaGame from "../Classes/TriviaGame";
import { TriviaGameOptions, TriviaPlayer } from "./interfaces";

export type TriviaManagerGames = Collection<Snowflake, TriviaGame>;
export type TriviaPlayers = Collection<Snowflake, TriviaPlayer>;
export type TriviaGameState = "pending" | "queue" | "inProgress" | "ended";
export type TriviaCommandBuilderType = "BUILDER" | "JSON";
export type TriviaGameOptionKeys = keyof TriviaGameOptions;
