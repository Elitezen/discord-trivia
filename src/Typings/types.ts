import { Collection, Snowflake } from "discord.js";
import TriviaGame from "../Classes/TriviaGame";

export type TriviaManagerGames = Collection<Snowflake, TriviaGame>;