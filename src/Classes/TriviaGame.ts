import { Collection, CommandInteraction, GuildMember } from "discord.js";
import startComponentCollector from "../Functions/startComponentCollector";
import { TriviaGameData, TriviaGameOptions, TriviaGameOptionsStrict } from "../Typings/interfaces";
import validateTriviaGameOptions from "../Utility/validateTriviaGameOptions";
import DiscordTriviaError from "./DiscordTriviaError";
import TriviaManager from "./TriviaManager";

export default class TriviaGame {
  public readonly interaction: CommandInteraction;
  public readonly manager: TriviaManager;
  public readonly options: TriviaGameOptions;

  public data: TriviaGameData = {
    hostMember: {} as GuildMember,
    players: new Collection()
  };

  public static readonly defaults:TriviaGameOptionsStrict = {
    minPlayerCount: 1,
    maxPlayerCount: 50,
    timePerQuestion: 20_000,
    triviaCategory: null,
    questionAmount: 10,
    questionDifficulty: null,
    questionType: null,
    queueTime: 15_000
  };

  constructor(interaction: CommandInteraction, manager: TriviaManager, options?:TriviaGameOptions) {
    this.interaction = interaction;
    this.manager = manager;
    
    if (options) {
      this.options = Object.assign(TriviaGame.defaults, options);
    } else {
      this.options = TriviaGame.defaults;
    }
  }

  start(): Promise<void> {
    return new Promise(async(resolve, reject) => {
      try {
        validateTriviaGameOptions(this.options);
        if (!this.interaction.guildId) return; // Throw Error
        const guild = await this.interaction.client.guilds
          .fetch(this.interaction.guildId);
        const channel = await this.interaction.client.channels
          .fetch(this.interaction.channelId);

        if (channel === null || !channel.isText()) return; // Throw Error
        if (this.manager.games.has(channel.id)) reject(new DiscordTriviaError(
          'There can only be one ongoing game per channel',
          'GAME_IN_PROGRESS'
        ));

        this.manager.games.set(channel.id, this);

        this.interaction.reply({
          content: '<GAME START MESSAGE>',
          ephemeral: true
        });

        await startComponentCollector(this, guild, channel);
      } catch (err) {
        reject(err);
      }
    });
  }
}