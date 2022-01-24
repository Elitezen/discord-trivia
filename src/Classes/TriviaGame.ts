import {
  Collection,
  ColorResolvable,
  CommandInteraction,
  GuildMember,
} from "discord.js";
import startComponentCollector from "../Functions/GameFunctions/startComponentCollector";
import {
  TriviaGameData,
  TriviaGameOptions,
  TriviaGameOptionsFinal,
} from "../Typings/interfaces";
import validateTriviaGameOptions from "../Utility/validateTriviaGameOptions";
import DiscordTriviaError from "./DiscordTriviaError";
import TriviaManager from "./TriviaManager";
import {
  TriviaCategoryName,
  TriviaQuestionDifficulty,
  TriviaQuestionType,
} from "easy-trivia";

export default class TriviaGame {
  public readonly interaction: CommandInteraction;
  public readonly manager: TriviaManager;
  public readonly options: TriviaGameOptionsFinal;

  public data: TriviaGameData = {
    hostMember: {} as GuildMember,
    players: new Collection(),
  };

  public static readonly BaseColor: ColorResolvable = "BLURPLE";
  public static readonly defaults: TriviaGameOptionsFinal = {
    minPlayerCount: 1,
    maxPlayerCount: 50,
    timePerQuestion: 20_000,
    triviaCategory: null as unknown as TriviaCategoryName,
    questionAmount: 10,
    questionDifficulty: null as unknown as TriviaQuestionDifficulty,
    questionType: null as unknown as TriviaQuestionType,
    queueTime: 15_000,
  };

  constructor(
    interaction: CommandInteraction,
    manager: TriviaManager,
    options?: TriviaGameOptions
  ) {
    this.interaction = interaction;

    this.manager = manager;

    if (options) {
      this.options = Object.assign(
        TriviaGame.defaults,
        options
      ) as TriviaGameOptionsFinal;
    } else {
      this.options = TriviaGame.defaults;
    }
  }

  start(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        validateTriviaGameOptions(this.options);

        if (!this.interaction.guildId)
          throw new DiscordTriviaError(
            "Failed to access Guild",
            "GUILD_FETCH_FAILED"
          );

        const guild = await this.interaction.client.guilds.fetch(
          this.interaction.guildId
        );
        const channel = await this.interaction.client.channels.fetch(
          this.interaction.channelId
        );

        if (channel == null || !channel.isText())
          throw new DiscordTriviaError(
            "TextChannel is not of type text or cannot be accessed",
            "TEXT_CHANNEL_INVALID"
          );
        if (this.manager.games.has(channel.id))
          reject(
            new DiscordTriviaError(
              "There can only be one ongoing game per channel",
              "GAME_IN_PROGRESS"
            )
          );

        this.manager.games.set(channel.id, this);

        this.interaction.reply({
          content: "Game has been created",
          ephemeral: true,
        });

        await startComponentCollector(this, guild, channel);
      } catch (err) {
        reject(err);
      }
    });
  }
}
