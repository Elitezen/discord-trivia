import { Collection, ColorResolvable, CommandInteraction } from "discord.js";
import {
  TriviaGameMessages,
  TriviaGameMessagesFinal,
  TriviaGameOptions,
  TriviaManagerOptions,
  TriviaManagerOptionsFinal,
} from "../Typings/interfaces";
import { TriviaManagerGames } from "../Typings/types";
import DiscordTriviaError from "./DiscordTriviaError";
import TriviaGame from "./TriviaGame";

export default class TriviaManager {
  public readonly theme: ColorResolvable;
  public readonly games: TriviaManagerGames = new Collection();
  public readonly messages: TriviaGameMessagesFinal;
  public static readonly defaults: TriviaManagerOptionsFinal = {
    theme: "BLURPLE",
    messages: {
      playerJoinedQueue: "🎮 {{player}} has joined!",
      alreadyJoined: "✅ You are already in the queue",
    },
  };

  constructor(options?: TriviaManagerOptions) {
    this.theme = options?.theme ? options.theme : TriviaGame.BaseColor;
    if (options?.messages) {
      this.messages = Object.assign(
        TriviaManager.defaults,
        options.messages
      ) as TriviaGameMessagesFinal;
    } else {
      this.messages = TriviaManager.defaults.messages;
    }
  }

  createGame(interaction: CommandInteraction, options?: TriviaGameOptions) {
    if (!interaction.isCommand())
      throw new DiscordTriviaError(
        "Supplied interaction must be a CommandInteraction",
        "INVALID_INTERACTION"
      );

    return new TriviaGame(interaction, this, options);
  }
}
