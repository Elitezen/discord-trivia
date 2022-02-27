import { Collection, ColorResolvable, CommandInteraction, GuildMember, MessageButton, MessageEmbed } from "discord.js";
import { Categories } from "easy-trivia";
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

  private static readonly BaseColor:ColorResolvable = "BLURPLE";

  public static readonly defaults:TriviaGameOptionsStrict = {
    minPlayerCount: 1,
    maxPlayerCount: 50,
    timePerQuestion: 20_000,
    triviaCategory: null,
    questionAmount: 10,
    questionDifficulty: null,
    questionType: null,
    queueTime: 15_000,
    gameMessages: {
      gameEmbed: new MessageEmbed().setTitle(`Trivia Game`)
      .setColor(this.BaseColor)
      .setDescription('A new trivia game is starting!')
      .setFooter({
        text: 'Discord Trivia'
      }),
      gameEmbedReady: new MessageEmbed().setTitle(`Trivia Game Started`)
      .setColor(this.BaseColor)
      .setDescription('The game has started! All the players have joined.')
      .setFooter({
        text: 'Discord Trivia'
      }),
      joinedQueue: "You have joined the queue!",
      playerJoinedQueue: "{{playerMention}} has joined the queue",
      startMessage: "The game has started waiting for players. Once all the players have joined the game will begin!",
      alreadyJoined: "You already joined this game!",
      joinButton: new MessageButton()
      .setLabel("Join")
      .setStyle("PRIMARY")
      .setCustomId("not-yet-added"),
      baseLeaderboardEmbed: new MessageEmbed()
      .setColor(this.BaseColor)
      .setTitle("Trivia game leaderboard."),
      baseQuestionEmbed: new MessageEmbed()
      .setColor(this.BaseColor)
    }
  };

  constructor(interaction: CommandInteraction, manager: TriviaManager, options?:TriviaGameOptions) {
    /**
     * The command interaction for the game.
     */
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

        if (!this.interaction.guildId) throw new TypeError('guildId returned falsey');

        const { options } = this;

        const guild = await this.interaction.client.guilds
          .fetch(this.interaction.guildId);

        const channel = await this.interaction.client.channels
          .fetch(this.interaction.channelId);

        if (channel == null || !channel.isText()) throw new TypeError('channel returned null or is not of type text');
        if (this.manager.games.has(channel.id)) reject(new DiscordTriviaError(
          'There can only be one ongoing game per channel',
          'GAME_IN_PROGRESS'
        ));

        this.manager.games.set(channel.id, this);

        this.interaction.reply({
          content: (options.gameMessages || TriviaGame.defaults.gameMessages).startMessage,
          ephemeral: true
        });

        await startComponentCollector(this, guild, channel);
      } catch (err) {
        reject(err);
      }
    });
  }
}