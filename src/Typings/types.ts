import { Collection, Snowflake } from "discord.js";
import TriviaGame from "../Classes/TriviaGame";
import { TriviaGameOptions, TriviaPlayer } from "./interfaces";

export type TriviaManagerGames = Collection<Snowflake, TriviaGame>;
export type TriviaPlayers = Collection<Snowflake, TriviaPlayer>;
export type TriviaGameOptionKeys = keyof TriviaGameOptions;

export enum TriviaCommandBuilderType {
    Builder = "BUILDER",
    JSON = "JSON"
};

export enum TriviaGameState {
    Pending = "pending",
    Queue = "queue",
    InProgress = "inProgress",
    Ended = "ended"
}
