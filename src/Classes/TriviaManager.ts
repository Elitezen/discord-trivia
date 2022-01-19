import { Collection, Interaction } from "discord.js";
import { TriviaGameOptions } from "../Typings/interfaces";
import { TriviaManagerGames } from "../Typings/types";
import DiscordTriviaError from "./DiscordTriviaError";
import TriviaGame from "./TriviaGame";

export default class TriviaManager {
  public readonly games: TriviaManagerGames = new Collection();

  constructor(/*options?:TriviaManagerOptions*/) {

  }

  createGame(interaction: Interaction, options?:TriviaGameOptions) {
    if (!interaction.isCommand()) throw new DiscordTriviaError(
      'Supplied interaction must be a CommandInteraction',
      'INVALID_INTERACTION'
    );

    return new TriviaGame(interaction, this, options);
  }
}