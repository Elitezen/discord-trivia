import { Collection, Snowflake } from "discord.js";
import TriviaGame from "../Classes/TriviaGame";
import { TriviaPlayer } from "./interfaces";

export type TriviaManagerGames = Collection<Snowflake, TriviaGame>;
export type TriviaPlayers = Collection<Snowflake, TriviaPlayer>;
export type TriviaGameState = "PENDING" | "QUEUE" | "IN_PROGRESS" | "ENDED";
