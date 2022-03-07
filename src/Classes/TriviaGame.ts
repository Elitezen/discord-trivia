import {
  Collection,
  CollectorFilter,
  CommandInteraction,
  Guild,
  GuildMember,
  InteractionReplyOptions,
  Message,
  MessageComponentInteraction,
  TextBasedChannel,
} from "discord.js";
import {
  getQuestions,
  TriviaCategoryName,
  TriviaQuestion,
  TriviaQuestionDifficulty,
  TriviaQuestionType,
} from "easy-trivia";
import TriviaManager from "./TriviaManager";
import {
  TriviaGameOptions,
  TriviaGameOptionsStrict,
  TriviaPlayer,
} from "../Typings/interfaces";
import EmbedGenerator from "./EmbedGenerator";
import { TriviaGameState, TriviaPlayers } from "../Typings/types";
// import CanvasGenerator from "./CanvasGenerator";
import {
  buttonRowChoicesBoolean,
  buttonRowChoicesMultiple,
  buttonRowQueue,
} from "../Components/messageActionRows";
import { promisify } from "util";

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

export default class TriviaGame {
  public readonly manager: TriviaManager;
  public readonly interaction: CommandInteraction;
  public readonly channel: TextBasedChannel;
  public readonly guild: Guild;
  public readonly hostMember: GuildMember;
  private readonly embeds: EmbedGenerator;
  // private readonly canvas: CanvasGenerator;
  public readonly players: TriviaPlayers;
  public readonly options: TriviaGameOptionsStrict;
  public state: TriviaGameState;
  private questions: TriviaQuestion[];
  public leaderboard: TriviaPlayers;
  public messages: Collection<string, Message>;

  public static readonly defaults: TriviaGameOptionsStrict = {
    minPlayerCount: 1,
    maxPlayerCount: 50,
    timePerQuestion: 20_000,
    triviaCategory: null as unknown as TriviaCategoryName,
    questionAmount: 10,
    questionDifficulty: null as unknown as TriviaQuestionDifficulty,
    questionType: null as unknown as TriviaQuestionType,
    queueTime: 15_000,
    minPoints: 1,
    maxPoints: 100,
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
    this.questions = [];
    this.hostMember = interaction.member as GuildMember;
    this.leaderboard = new Collection();
    this.options = options
      ? Object.assign(TriviaGame.defaults, options)
      : TriviaGame.defaults;
    this.state = "PENDING";
    this.embeds = new EmbedGenerator(this);
    this.messages = new Collection();
    // this.canvas = new CanvasGenerator(this);
  }

  static buttonRows = {
    multiple: buttonRowChoicesMultiple,
    boolean: buttonRowChoicesBoolean,
    queue: buttonRowQueue,
  };

  start(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (this.state == "ENDED") return;

      try {
        this.manager.validator.validateDiscordStructures(this);
        this.manager.validator.validateGameOptions(this.options);

        this.manager.games.set(this.channel.id, this);

        await this.interaction.reply({
          content: "Game has started. Click the join button to enter",
          ephemeral: true,
        });

        await this.startComponentCollector();
      } catch (err) {
        reject(err);
      }
    });
  }

  end() {
    this.manager.games.delete(this.channel.id);
    this.state = "ENDED";
  }

  private async beginGameLoop() {
    for await (const question of this.questions) {
      if (this.state == "ENDED") return;

      const msg = await this.channel.send({
        content: "🕥 **Preparing the next question...**",
      });

      this.messages.set(msg.id, msg);
      await wait(7500);
      await this.emitQuestion(question);
    }

    const msg1 = await this.channel.send({
      embeds: [this.embeds.finalLeaderboard()],
    });

    this.messages.set(msg1.id, msg1);
    this.end();
  }

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
      p.hasAnswered = false;
      p.isCorrect = false;
    });

    this.updateLeaderboard();
  }

  private calculatePoints(timePassed: number) {
    const { timePerQuestion, maxPoints, minPoints } = this.options;
    const timeProportion = Number(
      (timePassed / timePerQuestion).toPrecision(2)
    );
    const points =
      maxPoints - Math.ceil((maxPoints - minPoints) * timeProportion);

    return points;
  }

  private async emitQuestion(question: TriviaQuestion): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (this.state == "ENDED") return;
      const emissionTime = performance.now();

      const msg = await this.channel.send({
        embeds: [this.embeds.question(question)],
        components: [TriviaGame.buttonRows[question.type]],
      });

      this.messages.set(msg.id, msg);

      const filter: CollectorFilter<[MessageComponentInteraction<"cached">]> = (
        i
      ) => this.players.has(i.user.id);
      const collector = this.channel.createMessageComponentCollector({
        filter,
        time: this.options.timePerQuestion,
      });

      collector.on("collect", async (i) => {
        if (this.state == "ENDED") return;

        const player = this.players.get(i.user.id)!;
        const member = await this.guild.members.fetch(i.user.id);

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
        } else if (
          question.checkAnswer(question.allAnswers[Number(i.customId)])
        ) {
          const answerTime = performance.now();
          const timeElapsed = answerTime - emissionTime;

          player.points += this.calculatePoints(timeElapsed);
          player.isCorrect = true;
        }

        await reply(i, {
          content: "🔹 Your answer has been locked in",
          ephemeral: true,
        });

        const msg1 = await this.channel.send({
          content: `**${member.displayName}** has locked in!`,
        });

        this.messages.set(msg1.id, msg1);

        player.hasAnswered = true;
      });

      collector.on("end", async () => {
        if (this.state == "ENDED") return;

        const msg2 = await this.channel.send({
          embeds: [this.embeds.leaderboardUpdate()],
        });

        setTimeout(() => {
          if (msg2.deletable) {
            msg2.delete().catch((_) => null);
          }
        }, 10_000);

        await this.prepareNextRound();
        await wait(5000);
        resolve();
      });
    });
  }

  private async initializeGame() {
    if (this.state == "ENDED") return;

    const {
      questionAmount: amount,
      questionDifficulty: difficulty,
      questionType: type,
      triviaCategory: category,
    } = this.options;

    this.updateLeaderboard();

    this.questions = await getQuestions({
      amount,
      difficulty: difficulty!,
      type: type!,
      category: category!,
    });

    const msg = await this.channel.send({
      embeds: [this.embeds.gameStart()],
    });

    this.messages.set(msg.id, msg);

    await this.beginGameLoop();
  }

  private async startComponentCollector() {
    this.state = "QUEUE";

    const msg = await this.channel.send({
      embeds: [this.embeds.gameQueueStart()],
      components: [TriviaGame.buttonRows.queue],
    });

    this.messages.set(msg.id, msg);

    const collector = this.channel.createMessageComponentCollector({
      time: this.options.queueTime,
    });

    collector.on("collect", async (int) => {
      if (this.state == "ENDED") return;
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
        });

        this.players.set(player.id, player);

        const msg1 = await this.channel.send({
          content: `🙌   **${player.displayName}** has joined in!`,
        });

        this.messages.set(msg1.id, msg1);

        if (this.players.size === this.options.maxPlayerCount) {
          collector.stop("Game has reached set maximum player capacity");
        }
      }
    });

    collector.on("end", async () => {
      if (this.state == "ENDED") return;

      if (
        collector.endReason ||
        this.players.size >= this.options.minPlayerCount
      ) {
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

  private updateLeaderboard() {
    this.leaderboard = this.players.sort((a, b) => {
      return a.points - b.points;
    });
  }
}
