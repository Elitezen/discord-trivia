import {
  Collection,
  CommandInteraction,
  Guild,
  GuildMember,
  MessageActionRow,
  MessageButton,
  TextBasedChannel,
} from "discord.js";
import {
  TriviaCategoryName,
  TriviaQuestionDifficulty,
  TriviaQuestionType,
} from "easy-trivia";
import TriviaManager from "./TriviaManager";
import {
  TriviaGameOptions,
  TriviaGameOptionsStrict,
} from "../Typings/interfaces";
import validateTriviaGameOptions from "../Functions/GameFunctions/validateTriviaGameOptions";
import validateDiscordStructures from "../Functions/GameFunctions/validateDiscordStructures";
import startComponentCollector from "../Functions/GameFunctions/startComponentCollector";
import EmbedGenerator from "./EmbedGenerator";
import { TriviaPlayers } from "../Typings/types";
import CanvasGenerator from "./CanvasGenerator";

export default class TriviaGame {
  public readonly manager: TriviaManager;
  public readonly interaction: CommandInteraction;
  public readonly channel: TextBasedChannel;
  public readonly guild: Guild;
  public readonly hostMember: GuildMember;
  public readonly embeds: EmbedGenerator;
  public readonly canvas: CanvasGenerator;

  public readonly players: TriviaPlayers;
  public readonly options: TriviaGameOptionsStrict;

  public static readonly defaults: TriviaGameOptionsStrict = {
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
    this.manager = manager;
    this.interaction = interaction;
    this.channel = interaction.channel as TextBasedChannel;
    this.guild = interaction.guild as Guild;
    this.players = new Collection();
    this.hostMember = interaction.member as GuildMember;
    this.options = options
      ? Object.assign(TriviaGame.defaults, options)
      : TriviaGame.defaults;
    this.embeds = new EmbedGenerator(this);
    this.canvas = new CanvasGenerator(this);
  }

  static buttonRows = {
    'multiple': new MessageActionRow()
      .addComponents([
        new MessageButton()
          .setCustomId('0')
          .setLabel('A')
          .setStyle('PRIMARY'),
        new MessageButton()
          .setCustomId('1')
          .setLabel('B')
          .setStyle('PRIMARY'),
        new MessageButton()
          .setCustomId('2')
          .setLabel('C')
          .setStyle('PRIMARY'),
        new MessageButton()
          .setCustomId('3')
          .setLabel('D')
          .setStyle('PRIMARY'),
      ]),
    'boolean': new MessageActionRow()
      .addComponents([
        new MessageButton()
          .setCustomId('0')
          .setLabel('TRUE')
          .setStyle('PRIMARY'),
        new MessageButton()
          .setCustomId('1')
          .setLabel('FALSE')
          .setStyle('DANGER'),
      ])
  };

  start(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        validateDiscordStructures(this.guild, this.channel);
        validateTriviaGameOptions(this.options);

        this.manager.games.set(this.channel.id, this);

        await this.interaction.reply({
          content: "Game has been started",
          ephemeral: true,
        });

        await startComponentCollector(this);
      } catch (err) {
        reject(err);
      }
    });
  }

  end() {
    this.manager.games.delete(this.channel.id);
  }
}
