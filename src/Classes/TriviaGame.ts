import {
  Collection,
  EmbedBuilder,
  Guild,
  GuildMember,
  InteractionReplyOptions,
  Message,
  MessageComponentInteraction,
  TextChannel,
} from "discord.js";
import {
  getQuestions,
  CategoryName,
  Question,
  QuestionDifficulty,
  QuestionType,
  OpenTDBUtil,
} from "open-trivia-db";
import TriviaManager from "./TriviaManager";
import {
  QuestionData,
  ResultPlayerData,
  TriviaGameOptions,
  TriviaGameResultData,
  TriviaPlayer,
} from "../Typings/interfaces";
import EmbedGenerator from "./EmbedGenerator";
import { TriviaGameState, TriviaPlayers } from "../Typings/types";
import DiscordTriviaError from "./DiscordTriviaError";
import {
  buttonRowChoicesBoolean,
  buttonRowChoicesMultiple,
  buttonRowQueue,
} from "../Components/messageActionRows";
import { promisify } from "util";
import { EventEmitter } from "events";
import RootComponent from "./RootComponent";
import prepareCustomQuestions from "../Functions/prepareCustomQuestions";

const wait = promisify(setTimeout);

async function reply(
  int: MessageComponentInteraction,
  obj: InteractionReplyOptions
) {
  if (int.replied) {
    await int.followUp(obj);
  } else {
    await int.reply(obj);
  }
}

declare interface TriviaGame {
  on(event: "pending", listener: () => void): this;
  on(event: "queue", listener: () => void): this;
  on(event: "inProgress", listener: () => void): this;
  on(event: "ended", listener: (data: TriviaGameResultData) => void): this;

  on(event: "playerJoinQueue", listener: (player: TriviaPlayer) => void): this;
}

/**
 * @class Class for trivia games. Holds dynamic data relating to the ongoing game.
 */
class TriviaGame extends EventEmitter implements TriviaGame {
  /**
   * The manager of this trivia game.
   * @readonly
   */
  public readonly manager: TriviaManager;

  /**
   * The interaction this game was initiated with.
   * @readonly
   */
  public readonly component: RootComponent;

  /**
   * The text channel this game was initiated in.
   * @readonly
   */
  public readonly channel: TextChannel;

  /**
   * The guild this game was initiated in.
   * @readonly
   */
  public readonly guild: Guild;

  /**
   * The member who initiated this game.
   * @readonly
   */
  public readonly hostMember: GuildMember;

  /**
   * The embed generator for this game.
   * @readonly
   * @private
   */
  private readonly embeds: EmbedGenerator;
  // private readonly canvas: CanvasGenerator;

  /**
   * The players participating in this game
   * @readonly
   */
  public readonly players: TriviaPlayers;

  /**
   * This game's configuration options.
   * @readonly
   */
  public readonly options: TriviaGameOptions;

  /**
   * The state of this game.
   * @readonly
   * @type {TriviaGameState}
   */
  public state: TriviaGameState;

  /**
   * This game's array of questions to be used.
   * @readonly
   */
  private questions: Question[];

  /**
   * This game's leaderboard.
   * @readonly
   */
  public leaderboard: TriviaPlayers;

  /**
   * This game's messages.
   * @readonly
   */
  public messages: Collection<string, Message>;

  public static readonly defaults: TriviaGameOptions = {
    questionData: {
      category: null as unknown as CategoryName,
      amount: 10,
      difficulty: null as unknown as QuestionDifficulty,
      type: null as unknown as QuestionType,
    },
    minimumPlayerCount: 1,
    maximumPlayerCount: 50,
    timePerQuestion: 20_000,
    queueTime: 15_000,
    minimumPoints: 1,
    maximumPoints: 100,
    timeBetweenRounds: 6000,
    pointsPerStreakAmount: 10,
    maximumStreakBonus: 30,
    streakDefinitionLevel: 3,
  };

  constructor(
    component: RootComponent,
    manager: TriviaManager,
    options?: Partial<TriviaGameOptions>
  ) {
    super();

    this.manager = manager;
    this.component = component;
    this.channel = component.channel as TextChannel;
    this.guild = component.guild as Guild;
    this.players = new Collection();
    this.questions = [];
    this.hostMember = component.hostMember as GuildMember;
    this.leaderboard = new Collection();
    this.options = {} as TriviaGameOptions;
    this.options = options
      ? Object.assign(TriviaGame.defaults, options)
      : TriviaGame.defaults;
    this.state = "pending";
    this.embeds = new EmbedGenerator(this);
    this.messages = new Collection();

    setImmediate(() => {
      this.emit("pending");
    });
  }

  static buttonRows = {
    multiple: buttonRowChoicesMultiple,
    boolean: buttonRowChoicesBoolean,
    queue: buttonRowQueue,
  };

  /**
   * Starts the trivia match.
   */
  start(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (this.state == "ended") return;

      this.options.questionData = Object.assign(
        {
          category: null as unknown as CategoryName,
          amount: 10,
          difficulty: null as unknown as QuestionDifficulty,
          type: null as unknown as QuestionType,
        },
        this.options.questionData
      );

      try {
        this.manager.validator.validateDiscordStructures(this);
        this.manager.validator.validateGameOptions(this.options);
        this.manager.games.set(this.channel.id, this);

        await this.startComponentCollector();
        await this.component.reply[this.component.type]({
          content: "Game has started. Click the join button to enter",
          ephemeral: true,
        });

        this.state = "queue";
        setImmediate(() => {
          this.emit("queue");
        });
      } catch (err) {
        this.state = "ended";
        this.emit("ended");
        this.component.followUp[this.component.type]({
          content: (err as DiscordTriviaError).message,
          ephemeral: true,
        });

        reject(err);
      }
    });
  }

  /**
   * The data of this game.
   * @type {TriviaGameResultData}
   */
  data(): TriviaGameResultData {
    const playerData: ResultPlayerData[] = this.players.map((p) => {
      return {
        id: p.id,
        points: p.points,
      };
    });
    const resultData: TriviaGameResultData = {
      gameConfiguration: this.options,
      hostMemberId: this.hostMember.id,
      players: playerData,
    };

    return resultData;
  }

  /**
   * Ends this game
   */
  end() {
    this.manager.games.delete(this.channel.id);
    this.state = "ended";
    setImmediate(() => {
      this.emit("ended", this.data());
    });
  }

  /**
   * Starts iterating through TriviaGame#questions and emits each.
   * @private
   */
  private async beginGameLoop() {
    for await (const question of this.questions) {
      if (this.state == "ended") return;

      const msg = await this.channel.send({
        content: "🕥 **Preparing the next question...**",
      });

      this.messages.set(msg.id, msg);
      await wait(this.options.timeBetweenRounds);
      await this.emitQuestion(question);
    }

    const msg1 = await this.channel.send({
      embeds: [this.embeds.finalLeaderboard().toJSON()],
    });

    this.messages.set(msg1.id, msg1);
    this.end();
  }

  /**
   * Prepares the game's data and channel for the next round.
   */
  private async prepareNextRound() {
    this.messages
      .filter((msg) => msg.deletable)
      .forEach(async (msg) => {
        try {
          await msg.delete();
        } catch (_) {
          return void 0;
        }
      });

    this.players.forEach((p) => {
      if (!p.hasAnswered) {
        p.correctAnswerStreak = 0;
      }

      p.hasAnswered = false;
      p.isCorrect = false;
    });

    this.updateLeaderboard();
  }

  /**
   * Calculates the amount of points to award the player.
   * @param {number} timePassed - The amount of time elapsed since the question's emission in ms.
   * @private
   */
  private calculatePoints(timePassed: number) {
    const {
      timePerQuestion,
      maximumPoints: maxPoints,
      minimumPoints: minPoints,
    } = this.options;
    const timeProportion = Number(
      (timePassed / timePerQuestion).toPrecision(2)
    );
    const points =
      maxPoints - Math.ceil((maxPoints - minPoints) * timeProportion);

    return points;
  }

  /**
   * Sends a question in the game's text channel and listens for answers.
   * @param {Question} question - The question to send.
   * @private
   */
  private async emitQuestion(question: Question): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (this.state == "ended") return;

      const msg = await this.channel.send({
        embeds: [this.embeds.question(question).toJSON()],
        components: [TriviaGame.buttonRows[question.type].toJSON()],
      });

      this.messages.set(msg.id, msg);

      const collector = this.channel.createMessageComponentCollector({
        time: this.options.timePerQuestion,
      });

      const emissionTime = performance.now();
      collector.on("collect", async (i) => {
        if (this.state == "ended") return;

        const answerTime = performance.now();
        let timeElapsed = answerTime - emissionTime - 500; // -500ms to account for API lag
        if (timeElapsed > this.options.timePerQuestion) return;

        const player = this.players.get(i.user.id);
        if (!player) {
          return void reply(i, {
            content: "❌ You are not apart of this match",
            ephemeral: true,
          });
        } else if (player.hasAnswered) {
          return void (await reply(i, {
            content: "❗ **You have already chosen an answer**",
            ephemeral: true,
          }));
        }

        player.hasAnswered = true;
        const answer = (
          question.type == "multiple" ? question.allAnswers : ["False", "True"]
        )[Number(i.customId)];
        player.isCorrect = question.checkAnswer(`${answer}`);

        if (player.isCorrect) {
          player.points += this.calculatePoints(timeElapsed);
          player.correctAnswerStreak++;

          if (
            player.correctAnswerStreak >= this.options.streakDefinitionLevel
          ) {
            const streakBonus = Math.min(
              Math.max(
                (player.correctAnswerStreak -
                  (this.options.streakDefinitionLevel - 1)) *
                  this.options.pointsPerStreakAmount,
                0
              ),
              this.options.maximumStreakBonus
            );

            player.points += streakBonus;
          }
        } else {
          player.isCorrect = false;
          player.correctAnswerStreak = 0;
        }

        await reply(i, {
          content: `🔹 Your answer has been locked in!\n\n⚡ **Speed: ${+(
            timeElapsed / 1000
          ).toFixed(2)} seconds**`,
          ephemeral: true,
        });

        const member = await this.guild.members.fetch(player.id);
        const msg1 = await this.channel.send({
          content: `**${member.displayName}** has locked in!`,
        });

        this.messages.set(msg1.id, msg1);
      });

      collector.on("end", async () => {
        if (this.state == "ended") return;

        this.players
          .filter((p) => !p.hasAnswered)
          .forEach((p) => (p.correctAnswerStreak = 0));

        const msg2 = await this.channel.send({
          embeds: [this.embeds.leaderboardUpdate(question).toJSON()],
        });

        setTimeout(() => {
          if (msg2.deletable) {
            msg2.delete().catch((_) => null);
          }
        }, 10_000);

        await this.prepareNextRound();
        await wait(this.options.timeBetweenRounds);
        resolve();
      });
    });
  }

  /**
   * Starts the chain of private functions to start the game.
   * @private
   */
  private async initializeGame() {
    if (this.state == "ended") return;
    const data = this.options.questionData;

    if (typeof data == "object" && !Array.isArray(data) && data !== null) {
      const { amount, difficulty, type, category } = data as QuestionData;

      this.questions = await getQuestions({
        amount,
        difficulty: difficulty!,
        type: type!,
        category: category!,
      });

      if (data?.customQuestions) {
        if (data.amount <= data.customQuestions.length) {
          this.questions = prepareCustomQuestions(
            data.customQuestions.slice(0, data.amount)
          );
        } else {
          this.questions = OpenTDBUtil.shuffleArray([
            ...this.questions,
            ...prepareCustomQuestions(data.customQuestions),
          ]);
        }
      }
    } else if (Array.isArray(data)) {
      this.questions = prepareCustomQuestions(data);
    } else {
      throw new TypeError(
        `Provided QuestionData must be of type QuestionData | CustomQuestion[], recieved ${typeof data}`
      );
    }

    const msg = await this.channel.send({
      embeds: [this.embeds.gameStart().toJSON()],
    });

    this.updateLeaderboard();
    this.messages.set(msg.id, msg);

    await this.beginGameLoop();
  }

  /**
   * Sets up a listener to collect answers.
   * @private
   */
  private async startComponentCollector() {
    const msg = await this.channel.send({
      embeds: [this.embeds.gameQueueStart().toJSON()],
      components: [TriviaGame.buttonRows.queue.toJSON()],
    });

    this.messages.set(msg.id, msg);

    const collector = this.channel.createMessageComponentCollector({
      time: this.options.queueTime,
    });

    collector.on("collect", async (int) => {
      if (this.state == "ended") return;
      if (this.players.has(int.user.id)) {
        const inQueueAlready: InteractionReplyOptions = {
          content: "❗ **You are already in the queue**",
          ephemeral: true,
        };

        await reply(int, inQueueAlready);
      } else {
        const member = await this.guild.members.fetch(int.user.id);
        if (!member) {
          reply(int, {
            content: "❌ Failed to enter you into the queue, please try again",
            ephemeral: true,
          });

          return;
        }

        const joinedQueue: InteractionReplyOptions = {
          content: "✅ Successfully joined queue",
          ephemeral: true,
        };

        await reply(int, joinedQueue);

        const player: TriviaPlayer = Object.assign(member, {
          points: 0,
          hasAnswered: false,
          isCorrect: false,
          correctAnswerStreak: 0,
        });

        this.players.set(player.id, player);
        this.emit("playerJoinQueue", player);

        const msg1 = await this.channel.send({
          content: `🙌   **${player.displayName}** has joined in!`,
        });

        this.messages.set(msg1.id, msg1);

        if (this.players.size === this.options.maximumPlayerCount) {
          collector.stop("Game has reached set maximum player capacity");
        }
      }
    });

    collector.on("end", async () => {
      if (this.state == "ended") return;
      if (this.players.size >= this.options.minimumPlayerCount) {
        await this.initializeGame();
      } else {
        this.end();

        const msg2 = await this.channel.send({
          content: "Game failed to meet minimum player requirements",
        });

        this.messages.set(msg2.id, msg2);
      }
    });
  }

  /**
   * Updates data in the game's leaderboard
   * @private
   */
  private updateLeaderboard() {
    this.leaderboard = this.players.sort((a, b) => {
      return b.points - a.points;
    });
  }
}

export default TriviaGame;
