import { Collection, CommandInteraction } from "discord.js";
import { TriviaGameOptions, TriviaManagerOptions } from "../Typings/interfaces";
import { TriviaManagerGames } from "../Typings/types";
import DiscordTriviaError from "./DiscordTriviaError";
import TriviaGame from "./TriviaGame";

export default class TriviaManager {
  public readonly options: TriviaManagerOptions;
  public readonly games: TriviaManagerGames;
  public static readonly defaults: TriviaManagerOptions = {
    theme: "BLURPLE",
  };

  constructor(options?: TriviaManagerOptions) {
    this.options = options
      ? Object.assign(TriviaManager.defaults, options)
      : TriviaManager.defaults;
    this.games = new Collection();
  }

  createGame(interaction: CommandInteraction, options?: TriviaGameOptions) {
    if (!interaction.isCommand()) {
      const { message, header } =
        DiscordTriviaError.errors.interactionNonCommand;
      throw new DiscordTriviaError(message, header);
    }

    return new TriviaGame(interaction, this, options);
  }
}
