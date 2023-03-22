import {
  Collection,
  Guild,
  GuildMember,
  Snowflake,
  TextBasedChannel,
  Message,
  ComponentType,
  ButtonInteraction,
  CacheType,
  ButtonStyle,
  ColorResolvable,
  TextChannel,
  InteractionCollector,
} from "discord.js";
import {
  DecorationOptions,
  GameData,
  GameOptions,
  GameQuestion,
  Player,
  TextOutputs,
} from "../Typings/interfaces";
import TriviaPlayer from "./TriviaPlayer";
import RootComponent from "./RootComponent";
import TriviaManager from "./TriviaManager";
import EmbedGenerator from "./EmbedGenerator";
import EventEmitter = require("events");
import { promisify } from "util";
import { GameEvents, GameStates } from "../Typings/enums";
import { CustomQuestion, Leaderboard } from "../Typings/types";
import { GameQuestionOptions } from "../Typings/interfaces";
import {
  Category,
  CategoryNameType,
  getQuestions,
  IncorrectAnswers,
  Question,
  QuestionTypes,
  Util,
} from "open-trivia-db";
import {
  buttonRowChoicesBoolean,
  buttonRowChoicesMultiple,
  buttonRowQueue,
} from "../Components/messageButtonRows";
import {
  BooleanQuestion,
  MultipleChoiceQuestion,
} from "./CustomQuestionBuilders";
import DiscordTriviaError from "./DiscordTriviaError";

const sleep = promisify(setTimeout);

declare interface TriviaGame {
  on(event: GameEvents.Pending | "pending", listener: () => void): this;
  on(event: GameEvents.Queue | "queue", listener: () => void): this;
  on(
    event: GameEvents.MemberJoin | "memberJoin",
    listener: (member: GuildMember) => void
  ): this;
  on(event: GameEvents.End | "end", listener: (data: GameData) => void): this;
}

/**
 * Represents a trivia game.
 * @extends {EventEmitter}
 * @implements {TriviaGame}
 */
class TriviaGame extends EventEmitter implements TriviaGame {
  /**
   * The embed generator for this game
   * @type {EmbedGenerator}
   * @readonly
   */
  public readonly embeds: EmbedGenerator;

  /**
   * The host of this trivia game.
   * @type {GuildMember}
   * @readonly
   */
  public readonly host: GuildMember;

  /**
   * The manager this game belongs to.
   * @type {TriviaManager}
   * @readonly
   */
  public readonly manager: TriviaManager;

  /**
   * The players of this game.
   * @type {Collection<Snowflake, TriviaPlayer>}
   * @readonly
   */
  public readonly players: Collection<Snowflake, TriviaPlayer>;

  /**
   * The guild of this trivia game.
   * @type {Guild}
   * @readonly
   */
  public readonly guild: Guild;

  /**
   * The channel of this trivia game.
   * @type {TextChannel}
   * @readonly
   */
  public readonly channel: TextChannel;

  /**
   * The component of this trivia game.
   * @type {RootComponent}
   * @readonly
   */
  public readonly component: RootComponent;

  /**
   * The queue message of this trivia game.
   * @type {Message | null}
   */
  public queueMessage: Message | null = null;

  /**
   * All the messages this game has created.
   * @type {Collection<Snowflake, () => Promise<Message<boolean>>>}
   */
  public messages: Collection<Snowflake, () => Promise<Message<boolean>>>;

  /**
   * The state of this trivia game.
   * @type {GameStates}
   */
  public state: GameStates;

  /**
   * The questions this trivia game will use.
   * @type {GameQuestion[]}
   */
  public questions: GameQuestion[] = [];

  /**
   * Represents this trivia game's leaderboard.
   * @type {Leaderboard}
   */
  public leaderboard: Leaderboard = new Collection();

  /**
   * The default game options for trivia games.
   * @type {GameOptions}
   * @static
   */
  public static gameOptionDefaults: GameOptions = {
    queueTime: 10_000,
    minPlayerCount: 2,
    minPoints: 1,
    maxPlayerCount: 50,
    maxPoints: 100,
    timeBetweenRounds: 7_000,
    timePerQuestion: 10_000,
    streakDefinitionLevel: 3,
    pointsPerSteakAmount: 10,
    maximumStreakBonus: 30,
    showAnswers: true,
  };

  /**
   * The default game options for questions in this trivia games.
   * @type {GameQuestionOptions}
   * @static
   */
  public static gameQuestionOptionDefaults: GameQuestionOptions = {
    amount: 10,
    customQuestions: null,
  };

  /**
   * This game's set game options.
   * @type {GameOptions}
   */
  public gameOptions: GameOptions = TriviaGame.gameOptionDefaults;

  /**
   * This game's set question options.
   * @type {GameQuestionOptions}
   */
  public gameQuestionOptions: GameQuestionOptions =
    TriviaGame.gameQuestionOptionDefaults;

  /**
   * This game's text output configuration
   * @type {TextOutputs}
   */
  public textOutputs: TextOutputs = TriviaGame.textOutputDefaults;

  /**
   * A record of a game's text outputting defaults.
   * @type {TextOutputs}
   */
  public static textOutputDefaults: TextOutputs = {
    alreadyQueued: (user) => "❗ **You are already in the queue**",
    preparingQuestion: () => "🕥 **Preparing the next question...**",
    notInMatch: () => "❌ You are not apart of this match",
    alreadyChoseAnswer: (user) => "❗ **You have already chosen an answer**",
    gameFailedRequirements: () =>
      "Game failed to meet minimum player requirements",
    answerLockedInPrivate: (user, timeElapsed) =>
      `🔹 Your answer has been locked in!\n\n⚡ **timeElapsed: ${+(
        timeElapsed / 1000
      ).toFixed(2)} seconds**`,
    memberJoinedGamePrivate: () => "You have joined the game!",
    // answerLockedInPublic: (player:Player) => `**${player.member.displayName}** has locked in!`
    // memberJoinedGame: (member:GuildMember) => string;
  };

  /**
   * Handles adding new members to the game.
   *
   */
  protected playerFilter = {
    /**
     * Runs a function with a provided member. This function must return true to allow the member into the game.
     * @param member
     * @returns {boolean}
     */
    callback: (member: GuildMember): boolean => true,

    /**
     * The text to reply with if a member was rejected from the callback function.
     * @type {string}
     */
    rejectionText: "You do not meet the criteria to join this game",
  };

  /**
   * The decoration options for this game.
   * @type {DecorationOptions}
   */
  public decoration: DecorationOptions;

  constructor(root: RootComponent, manager: TriviaManager) {
    super();

    this.embeds = new EmbedGenerator(this);
    this.host = root.member;
    this.manager = manager;
    this.decoration = manager.decoration;
    this.players = new Collection();
    this.guild = root.guild;
    this.channel = root.channel;
    this.component = root;
    this.state = GameStates.Pending;
    this.messages = new Collection();

    this.setState(GameStates.Pending);
    this.emit("pending");
    return this;
  }

  /**
   * Returns the current data of this game.
   * @param {boolean} hasEnded Whether this game has finalized.
   * @returns {GameData}
   */
  public data(hasEnded: boolean): GameData {
    const category =
      typeof this.gameQuestionOptions.category !== "undefined"
        ? isNaN(+this.gameQuestionOptions.category)
          ? this.gameQuestionOptions.category
          : Category.nameById(+this.gameQuestionOptions.category)
        : null;

    return {
      questions: this.questions,
      category:
        category !== null && isNaN(+category)
          ? Category.idByName(category as unknown as CategoryNameType)
          : category,
      difficulty: this.gameQuestionOptions.difficulty || null,
      amount: this.gameQuestionOptions.amount,
      timeEnd: hasEnded ? Date.now() : null,
      players: this.leaderboard,
    };
  }

  /**
   * Adds user created questions to the game.
   * @param {(CustomQuestion<QuestionTypes> | BooleanQuestion | MultipleChoiceQuestion)[]} questions The custom questions.
   * @returns {this}
   */
  public setCustomQuestions(
    questions: (
      | CustomQuestion<QuestionTypes>
      | BooleanQuestion
      | MultipleChoiceQuestion
    )[]
  ): this {
    const formattedQuestions: GameQuestion[] = questions.map((q) => {
      const isBuilder =
        q instanceof BooleanQuestion || q instanceof MultipleChoiceQuestion;
      const _q = isBuilder ? q.data : q;

      if (!_q.value)
        throw new DiscordTriviaError("Custom Question is missing .value");
      if (!_q.type)
        throw new DiscordTriviaError("Custom Question is missing .type");
      if (!_q.correctAnswer)
        throw new DiscordTriviaError(
          "Custom Question is missing _q.correctAnswer"
        );

      return {
        value: _q.value,
        category: _q.category || "Custom",
        difficulty: _q.difficulty || "easy",
        type: _q.type,
        correctAnswer: _q.correctAnswer,
        incorrectAnswers:
          _q.incorrectAnswers ||
          (_q.correctAnswer === "true" ? "false" : "true"),
        allAnswers:
          _q.type === QuestionTypes.Boolean
            ? ["true", "false"]
            : Util.shuffleArray([
                _q.correctAnswer,
                ...(_q.incorrectAnswers as IncorrectAnswers),
              ]),
        checkAnswer: function (str: string) {
          return str.toLowerCase() === this.correctAnswer.toLowerCase();
        },
      };
    });

    this.questions = [...formattedQuestions];

    return this;
  }

  /**
   * Sets the text outputs for the game
   * @param {TextOutputs} options
   * @returns {this}
   */
  public setGameTexts(options: Partial<TextOutputs>): this {
    this.textOutputs = Object.assign(TriviaGame.textOutputDefaults, options);
    return this;
  }

  /**
   * Sets this game's game options.
   * @param {Partial<GameOptions>} options
   * @returns {this}
   */
  public setGameOptions(options: Partial<GameOptions>): this {
    this.gameOptions = Object.assign(TriviaGame.gameOptionDefaults, options);
    return this;
  }

  /**
   * Sets this game's question options.
   * @param {GameQuestionOption} options
   * @returns {this}
   */
  public setQuestionOptions(
    options: Omit<GameQuestionOptions, "customQuestions">
  ): this {
    if (options.category)
      options.category = isNaN(+options.category)
        ? Category.idByName(options.category as CategoryNameType)!
        : options.category;

    this.gameQuestionOptions = Object.assign(
      TriviaGame.gameQuestionOptionDefaults,
      options
    );

    return this;
  }

  /**
   * Sets the state of this game.
   * @param {GameStates} state
   */
  protected setState(state: GameStates) {
    this.state = state;
  }

  /**
   * Sets the member filter data for this game.
   * @returns {this}
   */
  public setMemberFilter(options: {
    callback: (member: GuildMember) => boolean;
    rejectionText?: string;
  }): this {
    this.playerFilter.callback = options.callback;
    if (typeof options.rejectionText === "string")
      this.playerFilter.rejectionText = options.rejectionText;

    return this;
  }

  /**
   * Sets the embed colors for this game's generated embeds.
   * @param {ColorResolvable} color
   * @returns {this}
   */
  public setEmbedColor(color: ColorResolvable): this {
    this.decoration.embedColor = color;
    return this;
  }

  /**
   * Sets the button style for this game's buttons.
   * @param {ButtonStyle} style
   * @returns {this}
   */
  public setButtonStyle(style: ButtonStyle): this {
    this.decoration.buttonStyle = style;
    return this;
  }

  /**
   * Sets the embed thumbnails for this game's generated embeds.
   * @param {string} url
   * @returns {this}
   */
  public setThumbnail(url: string): this {
    this.decoration.embedThumbnail = url;
    return this;
  }

  /**
   * Sets the embed image for this game's generated embeds.
   * @param {string} url
   * @returns {this}
   */
  public setImage(url: string): this {
    this.decoration.embedImage = url;
    return this;
  }

  /**
   * Applies decoration options for this game.
   * @param {Partial<DecorationOptions>} options
   * @returns {this}
   */
  public decorate(options: Partial<DecorationOptions>): this {
    this.decoration = Object.assign(this.decoration, options);
    return this;
  }

  /**
   * Ends this trivia game.
   * @param {boolean} [timedOut = false] Whether the game ended because of a queue timeout.
   */
  public end(timedOut: boolean = false): void {
    this.setState(GameStates.Ended);
    this.emit(GameEvents.End, this.data(true));
    if (!timedOut)
      this.channel.send({
        embeds: [this.embeds.finalLeaderboard().toJSON()],
      });
  }

  /**
   * Sets up game's creation.
   */
  public async setup(): Promise<void> {
    this.setState(GameStates.Queue);
    this.emit(GameEvents.Queue);

    this.manager.games.set(this.channel.id, this);

    let msg = await this.component.reply({
      embeds: [this.embeds.gameQueue()],
      components: [buttonRowQueue(this.decoration.buttonStyle)],
      fetchReply: true,
    });

    if (msg.deletable) this.messages.set(msg.id, msg.delete);
    this.queueMessage = msg;

    await this.listenForNewPlayers(msg);
  }

  /**
   * Creates a listener for new members.
   * @private
   */
  private async listenForNewPlayers(
    embedMessage: Message<boolean>
  ): Promise<void> {
    const collector = this.queueMessage!.createMessageComponentCollector({
      time: this.gameOptions.queueTime,
      componentType: ComponentType.Button,
      max: this.gameOptions.maxPlayerCount,
    });

    const handler = this.handleMemberJoin.bind(this);

    collector.on("collect", (i) => handler(i, embedMessage));
    collector.on("end", async (_) => {
      if (
        collector.endReason !== "limit" &&
        this.players.size < this.gameOptions.minPlayerCount
      )
        return this.handleQueueTimeout();

      try {
        await this.initializeGame();
      } catch (err) {
        throw err;
      }
    });
  }

  /**
   * Handles a new member.
   * @param {ButtonInteraction<CacheType>} interaction
   * @private
   */
  private async handleMemberJoin(
    interaction: ButtonInteraction<CacheType>,
    embedMessage: Message<boolean>
  ): Promise<void> {
    const userId = interaction.user.id;
    if (this.players.has(userId)) {
      return void interaction.reply({
        content: this.textOutputs.alreadyQueued(interaction.user),
        ephemeral: true,
      });
    }

    const member = await this.guild.members.fetch(userId);
    if (!this.playerFilter.callback(member)) {
      return void interaction.reply({
        content: this.playerFilter.rejectionText,
        ephemeral: true,
      });
    }

    const player = new TriviaPlayer(this, member);

    this.players.set(member.id, player);
    this.emit(GameEvents.MemberJoin, player);
    await embedMessage.edit({
      embeds: [this.embeds.gameQueue()],
      components: [buttonRowQueue(this.decoration.buttonStyle)],
    });

    await interaction.reply({
      ephemeral: true,
      content: this.textOutputs.memberJoinedGamePrivate(),
    });
  }

  /**
   * Starts the game.
   * @private
   */
  private async initializeGame(): Promise<void> {
    this.leaderboard = this.players;
    const apiQuestions = await getQuestions(this.gameQuestionOptions);

    this.questions = [...this.questions, ...parseQuestions(apiQuestions)];

    function parseQuestions(
      qs: (Question<unknown> | GameQuestion)[]
    ): GameQuestion[] {
      return qs.map((q) => {
        return {
          value: q.value,
          category:
            typeof q.category === "string" ? q.category : q.category.name,
          difficulty: q.difficulty,
          correctAnswer: q.correctAnswer,
          incorrectAnswers: q.incorrectAnswers,
          allAnswers:
            q.type === QuestionTypes.Boolean
              ? ["true", "false"]
              : Util.shuffleArray([q.correctAnswer, ...q.incorrectAnswers]),
          type:
            q.type === "boolean"
              ? QuestionTypes.Boolean
              : QuestionTypes.Multiple,
          checkAnswer: (str) => str === q.correctAnswer,
        };
      });
    }

    let msg = await this.channel.send({
      embeds: [this.embeds.gameStart()],
    });

    if (msg.deletable) this.messages.set(msg.id, msg.delete);

    await sleep(TriviaGame.gameOptionDefaults.timeBetweenRounds);
    await this.beginGameLoop();
  }

  /**
   * Begins iterating through question and answer handling.
   * @private
   */
  private async beginGameLoop(): Promise<void> {
    let msg: Message;
    for await (const question of this.questions) {
      if (this.state === GameStates.Ended) break;
      msg = await this.channel.send({
        content: this.textOutputs.preparingQuestion(),
      });

      this.messages.set(msg.id, msg.delete);
      await sleep(this.gameOptions.timeBetweenRounds);
      await this.emitQuestion(question);
    }

    this.end();
  }

  /**
   * Shows a question and collects answers.
   * @param {GameQuestion} question
   * @private
   */
  private async emitQuestion(question: GameQuestion): Promise<void> {
    return new Promise(async (resolve) => {
      let msg = await this.channel.send({
        embeds: [this.embeds.question(question)],
        components: [
          question.type === QuestionTypes.Multiple
            ? buttonRowChoicesMultiple(this.decoration.buttonStyle)
            : buttonRowChoicesBoolean(this.decoration.buttonStyle),
        ],
      });

      this.messages.set(msg.id, msg.delete);

      const collector = this.channel.createMessageComponentCollector({
        time: this.gameOptions.timePerQuestion,
        componentType: ComponentType.Button,
      });

      const emissionTime = Date.now();
      collector.on("collect", async (i) => {
        let timeElapsed = Date.now() - emissionTime;
        if (timeElapsed > this.gameOptions.timePerQuestion) return;

        await this.handleAnswer(i, collector, question, msg, timeElapsed);
      });

      collector.on("end", async () => {
        await this.handleRoundEnd(question);
        resolve();
      });
    });
  }

  /**
   * Handles a new answer
   * @param {ButtonInteraction<CacheType>} interaction
   * @param {GameQuestion} question
   * @param {number} timeElapsed
   * @private
   */
  private async handleAnswer(
    interaction: ButtonInteraction<CacheType>,
    collector: InteractionCollector<ButtonInteraction<CacheType>>,
    question: GameQuestion,
    embedMessage: Message<boolean>,
    timeElapsed: number
  ): Promise<void> {
    const player = this.players.get(interaction.user.id);
    if (!player) {
      return void interaction.reply({
        content: this.textOutputs.notInMatch(),
        ephemeral: true,
      });
    } else if (player.hasAnswered) {
      return void interaction.reply({
        content: this.textOutputs.alreadyChoseAnswer(interaction.user),
        ephemeral: true,
      });
    }

    await interaction.reply({
      content: this.textOutputs.answerLockedInPrivate(
        interaction.user,
        timeElapsed
      ),
      ephemeral: true,
    });

    // let msg = await this.channel.send({
    //   content: this.textOutputs.answerLockedInPublic(player)
    // });

    // this.messages.set(msg.id, msg.delete);

    player.hasAnswered = true;
    const answer = (
      question.type == QuestionTypes.Multiple
        ? question.allAnswers
        : ["false", "true"]
    )[Number(interaction.customId)];

    player.setIsCorrect(question.correctAnswer === answer);

    if (player.isCorrect) {
      player.addPoints(this.calculatePoints(timeElapsed));
      player.correctAnswerStreak++;

      if (
        player.correctAnswerStreak >= this.gameOptions.streakDefinitionLevel
      ) {
        const streakBonus = Math.min(
          Math.max(
            (player.correctAnswerStreak -
              (this.gameOptions.streakDefinitionLevel - 1)) *
              this.gameOptions.pointsPerSteakAmount,
            0
          ),
          this.gameOptions.maximumStreakBonus
        );

        player.addPoints(streakBonus);
      }
    } else {
      player.isCorrect = false;
      player.correctAnswerStreak = 0;
    }

    await embedMessage.edit({
      embeds: [this.embeds.question(question)],
      components: [
        question.type === QuestionTypes.Multiple
          ? buttonRowChoicesMultiple(this.decoration.buttonStyle)
          : buttonRowChoicesBoolean(this.decoration.buttonStyle),
      ],
    });

    if (this.players.every((player) => player.hasAnswered)) collector.stop();
  }

  /**
   * Handles the end of the round.
   * @param {GameQuestion} question
   * @private
   */
  private async handleRoundEnd(question: GameQuestion): Promise<void> {
    this.leaderboard = this.leaderboard.sort((a, b) => b.points - a.points);

    const msg = await this.channel.send({
      embeds: [this.embeds.leaderboardUpdate(question)],
    });

    if (msg.deletable) {
      setTimeout(() => {
        msg.delete().catch(() => null);
      }, 10_000);
    }

    await this.prepareNextRound();
    await sleep(this.gameOptions.timeBetweenRounds);
  }

  /**
   * Calculates the amount of points to award the player.
   * @param {number} timePassed - The amount of time elapsed since the question's emission in ms.
   * @private
   */
  private calculatePoints(timePassed: number) {
    const { timePerQuestion, maxPoints, minPoints } = this.gameOptions;
    const timeProportion = Number(
      (timePassed / timePerQuestion).toPrecision(2)
    );
    const points =
      maxPoints - Math.ceil((maxPoints - minPoints) * timeProportion);

    return points;
  }

  /**
   * Prepares this game's data for
   * @private
   */
  private async prepareNextRound(): Promise<void> {
    return new Promise((resolve) => {
      this.messages.forEach((deleter) => deleter().catch(() => null));
      this.players.forEach((p) => p.prepareForRound());

      resolve();
    });
  }

  /**
   * Handle's the game if queue times out
   * @private
   */
  private async handleQueueTimeout(): Promise<void> {
    this.end(true);

    await this.channel.send({
      content: this.textOutputs.gameFailedRequirements(),
    });
  }
}

export default TriviaGame;
