import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Collection, ComponentType, EmbedBuilder } from 'discord.js';
import type { ButtonInteraction, CacheType, CommandInteraction, GuildMember, InteractionCollector, Message, Snowflake, TextBasedChannel, User } from 'discord.js';
import type { GameConfig, GameData, GameMessageData, GameQuestion } from "../typings/interfaces";
import type GameManager from "./GameManager";
import Player from './Player';
import { promisify } from 'util';
import { Category, IncorrectAnswers, Question, QuestionTypes, Util, getQuestions } from 'open-trivia-db';
import { CustomQuestion } from '../typings/types';
import { BooleanQuestion, MultipleChoiceQuestion } from './CustomQuestionBuilder';
import { buttonRowChoicesBoolean, buttonRowChoicesMultiple } from '../components/buttons';
import { EventEmitter } from 'events';
import { GameEvents } from '../typings/enums';
import DefaultEmbeds from './DefaultEmbeds';

const wait = promisify(setTimeout);

declare interface TriviaGame {
	on(event: GameEvents.Pending | "pending", listener: () => void): this;
	on(event: GameEvents.Queue | "queue", listener: () => void): this;
	on(
	  event: GameEvents.PlayerJoin | "memberJoin",
	  listener: (member: GuildMember) => void
	): this;
	on(event: GameEvents.End | "end", listener: (data: GameData) => void): this;
}

export default class Game extends EventEmitter implements TriviaGame {
    public readonly channel: TextBasedChannel;
    public readonly manager: GameManager;
    public readonly players: Collection<Snowflake, Player> = new Collection();
    public queueMessage: Message | null = null;
    public leaderboard: Collection<Snowflake, Player> = new Collection();

    public questions:GameQuestion[] = [];

    public config: GameConfig = {
        buttons: {
          join: new ButtonBuilder().setCustomId("1").setLabel("Join").setStyle(ButtonStyle.Primary),
          questionOptionA: new ButtonBuilder().setCustomId("0").setLabel("A").setStyle(ButtonStyle.Secondary),
          questionOptionB: new ButtonBuilder().setCustomId("1").setLabel("B").setStyle(ButtonStyle.Secondary),
          questionOptionC: new ButtonBuilder().setCustomId("2").setLabel("C").setStyle(ButtonStyle.Secondary),
          questionOptionD: new ButtonBuilder().setCustomId("3").setLabel("D").setStyle(ButtonStyle.Secondary),
          questionOptionTrue: new ButtonBuilder().setCustomId("1").setLabel("True").setStyle(ButtonStyle.Primary),
          questionOptionFalse: new ButtonBuilder().setCustomId("0").setLabel("False").setStyle(ButtonStyle.Danger)
        },

        embeds: {
            queue: () => DefaultEmbeds.gameQueue(this),
            playerJoin: (player:Player) => DefaultEmbeds.playerJoin(player, this),
            gameStart: () => DefaultEmbeds.gameStart(this),
            gameQueueTimeout: () => DefaultEmbeds.gameQueueTimeout(),
            question: (question:GameQuestion) => DefaultEmbeds.question(this, question),
            leaderboardUpdate: (lastQuestion:GameQuestion) => DefaultEmbeds.leaderboardUpdate(lastQuestion, this),
            playerAlreadyAnswered: () => DefaultEmbeds.playerAlreadyAnswered(),
            playerAnsweredStats: (player:Player, timeElapsed:number) => DefaultEmbeds.playerAnsweredStats(this, player, timeElapsed),
            playerNotInMatch: () => DefaultEmbeds.playerNotInMatch(),
            playerAlreadyQueued: () => DefaultEmbeds.playerAlreadyQueued(),
            filterReject: () => DefaultEmbeds.filterRejected(),
            gameEnd: () => DefaultEmbeds.gameEnd(),
        },

        fetchQuestionsOptions: {
          amount: 10
        },

        customQuestions: [],

        showAnswers: true,

        minPlayerCount: 1,

        maxPlayerCount: 25,

        messageDeleter: {
            queue: null,
            gameStart: null,
            question: null,
            leaderboardUpdate: null
        },

        playerFilter: null,

        queueDuration: 15_000,

        timeBetweenRounds: 5_000,

        timeBetweenQuestions: 5_000,

        timePerQuestion: 10_000,

        minPoints: 1,
        
        maxPoints: 100,

        streakDefinitionLevel: 3,

        maximumStreakBonus: 3,

        pointsPerStreakAmount: 10
    }

    private async handleMessageDelete(message:Message, key: keyof GameMessageData) {
        const messageDeleterData = this.config.messageDeleter[key];

        if (messageDeleterData !== null && message.deletable) {
            setTimeout(async() => {
                try {
                    await message.delete();
                } catch (err) {
                    console.warn(err);
                }
            }, messageDeleterData);
        }
    }

    async addPlayer(user:User) {
        this.players.set(user.id, new Player(this, user));

       if (this.queueMessage) this.queueMessage.edit({
        embeds: [this.config.embeds.queue([...this.players.values()])],
        components: [
            new ActionRowBuilder<ButtonBuilder>()
                .setComponents(this.config.buttons.join)
        ]
    })
    }

    constructor(manager: GameManager, channel:TextBasedChannel) {
		super();

        this.manager = manager;
        this.channel = channel;

		this.emit(GameEvents.Pending);
    }

    async startQueue(interaction?:CommandInteraction):Promise<void> {
		this.emit(GameEvents.Queue);

        try {
            let queueMessage: Message;

            if (interaction) {
                queueMessage = await interaction.reply({
                    embeds: [this.config.embeds.queue()],
                    components: [
                        new ActionRowBuilder<ButtonBuilder>()
                            .setComponents(this.config.buttons.join)
                    ],
                    fetchReply: true
                  });
            } else {
                queueMessage = await this.channel.send({
                  embeds: [this.config.embeds.queue()],
                  components: [
                      new ActionRowBuilder<ButtonBuilder>()
                          .setComponents(this.config.buttons.join)
                  ]
                });
            }

            await this.handleMessageDelete(queueMessage, 'queue');
            await this.queueListener(queueMessage);
            this.queueMessage = queueMessage;
        } catch (err) {
            throw err;
        }
    }

    private async queueListener(message: Message) {
        const collector = message.createMessageComponentCollector({
            time: this.config.queueDuration,
            componentType: ComponentType.Button,
            max: this.config.maxPlayerCount
        });

        collector.on('collect', async interaction => {
            try {
                await this.handleMemberJoinRequest(interaction);
                if (this.players.size === this.config.maxPlayerCount) collector.stop('PLAYER_LIMIT_REACHED')
            } catch (err) {
                throw err;
            }
        });

        collector.on("end", async () => {
            if (this.players.size < this.config.minPlayerCount && collector.endReason == 'time') return this.handleQueueTimeout();
      
            try {
              await this.initializeGame();
            } catch (err) {
              throw err;
            }
          });
    }

    private async handleQueueTimeout() {
        this.channel.send({
            embeds: [this.config.embeds.gameQueueTimeout()]
        }).catch(console.error);
    }

    private async handleMemberJoinRequest(interaction: ButtonInteraction) {
        if (this.config.playerFilter && !(await this.config.playerFilter(interaction.user))) {
            return void interaction.reply({
                ephemeral: true,
                embeds: [this.config.embeds.filterReject(interaction.user)]
            });
        } else if (this.players.has(interaction.user.id)) {
            return void interaction.reply({
                ephemeral: true,
                embeds: [this.config.embeds.playerAlreadyQueued(this.players.get(interaction.user.id)!)]
            });
        }

        this.addPlayer(interaction.user);

		this.emit(GameEvents.PlayerJoin)

        await interaction.reply({
            ephemeral: true,
            embeds: [this.config.embeds.playerJoin(this.players.get(interaction.user.id)!)]
        });
    }

    private async initializeGame() {
        this.leaderboard = this.players;
		let fetchedQuestions: Question[] = [];
		let customQuestions: CustomQuestion<QuestionTypes.Boolean | QuestionTypes.Multiple>[] = [];

		if (this.config.fetchQuestionsOptions.amount > 0) {
			fetchedQuestions = await getQuestions(this.config.fetchQuestionsOptions);
		}
        
		if (this.config.customQuestions.length) {
			customQuestions = this.config.customQuestions;
		}

		this.questions = [...this.parseFetchedQuestions(fetchedQuestions), ...this.parseCustomQuestions(customQuestions)];

		if (!this.questions.length) throw new Error('This game has no questions loaded. Provide an amount for fetched questions or supply custom questions.')

        const gameStartMessage = await this.channel.send({
            embeds: [this.config.embeds.gameStart()]
        });

        await this.handleMessageDelete(gameStartMessage, 'gameStart');
        await wait(this.config.timeBetweenRounds);

        await this.startGameCycle();
    }

    private async startGameCycle() {
        for await (const question of this.questions) {
            await this.emitQuestion(question);
            await wait(this.config.timeBetweenQuestions);
        }

		this.emit(GameEvents.End);

        await this.channel.send({
            embeds: [this.config.embeds.gameEnd(this.leaderboard)]
        });
    }

    private async emitQuestion(question:GameQuestion): Promise<void> {
		const { questionOptionA, questionOptionB, questionOptionC, questionOptionD, questionOptionFalse, questionOptionTrue }= this.config.buttons;
        return new Promise(async resolve => {
			console.log(question.correctAnswer)
            let questionMessage = await this.channel.send({
                embeds: [this.config.embeds.question(question)],
				components: [
					question.type === QuestionTypes.Multiple
					  ? buttonRowChoicesMultiple([questionOptionA, questionOptionB, questionOptionC, questionOptionD])
					  : buttonRowChoicesBoolean([questionOptionTrue, questionOptionFalse]),
				]
            });

            const emissionTime = Date.now();

            await this.handleMessageDelete(questionMessage, 'question');

            const collector = questionMessage.createMessageComponentCollector({
                time: this.config.timePerQuestion,
                componentType: ComponentType.Button,
            });
            
            collector.on("collect", async (i) => {
                let timeElapsed = Date.now() - emissionTime;
                if (timeElapsed > this.config.timePerQuestion) return;
        
                await this.handleAnswer(i, collector, question, questionMessage, timeElapsed);
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
        interaction: ButtonInteraction,
        collector:  InteractionCollector<ButtonInteraction<CacheType>> | InteractionCollector<ButtonInteraction<"cached">>,
        question: GameQuestion,
        embedMessage: Message<boolean>,
        timeElapsed: number
    ): Promise<void> {
        const player = this.players.get(interaction.user.id);
        if (!player) {
        return void interaction.reply({
            embeds: [this.config.embeds.playerNotInMatch(interaction.user)],
            ephemeral: true,
        });
        } else if (player.hasAnswered) {
        return void interaction.reply({
            embeds: [this.config.embeds.playerAlreadyAnswered(player)],
            ephemeral: true,
        });
    }

    await interaction.reply({
      embeds: [this.config.embeds.playerAnsweredStats(player, timeElapsed)],
      ephemeral: true,
    });

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
        player.correctAnswerStreak >= this.config.streakDefinitionLevel
      ) {
        const streakBonus = Math.min(
          Math.max(
            (player.correctAnswerStreak -
              (this.config.streakDefinitionLevel - 1)) *
              this.config.pointsPerStreakAmount,
            0
          ),
          this.config.maximumStreakBonus
        );

        player.addPoints(streakBonus);
      }
    } else {
      player.isCorrect = false;
      player.correctAnswerStreak = 0;
    }

    await embedMessage.edit({
      embeds: [this.config.embeds.question(question)],
      components: [
        question.type === QuestionTypes.Multiple
          ? new ActionRowBuilder<ButtonBuilder>()
            .setComponents(
              this.config.buttons.questionOptionA.setCustomId("0"),
              this.config.buttons.questionOptionB.setCustomId("1"),
              this.config.buttons.questionOptionC.setCustomId("2"),
              this.config.buttons.questionOptionD.setCustomId("3"),
            )
          : new ActionRowBuilder<ButtonBuilder>()
            .setComponents(
              this.config.buttons.questionOptionTrue.setCustomId("1"),
              this.config.buttons.questionOptionFalse.setCustomId("0")
            ),
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
            embeds: [this.config.embeds.leaderboardUpdate(question)],
        });

        
        await this.handleMessageDelete(msg, 'leaderboardUpdate');
        await this.prepareNextRound();
        await wait(this.config.timeBetweenRounds);
    }

    /**
     * Calculates the amount of points to award the player.
     * @param {number} timePassed - The amount of time elapsed since the question's emission in ms.
     * @private
     */
    private calculatePoints(timePassed: number) {
        const { timePerQuestion, maxPoints, minPoints } = this.config;
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
        this.players.forEach((p) => p.prepareForRound());
  
        resolve();
      });
    }

	private parseCustomQuestions(questions: (
		| CustomQuestion<QuestionTypes>
		| BooleanQuestion
		| MultipleChoiceQuestion
	  )[]) {
		return questions.map((q) => {
			const isBuilder =
			  q instanceof BooleanQuestion || q instanceof MultipleChoiceQuestion;
			const _q = isBuilder ? q.data : q;
	  
			if (!_q.value)
			  throw new Error("Custom Question is missing .value");
			if (!_q.type)
			  throw new Error("Custom Question is missing .type");
			if (!_q.correctAnswer)
			  throw new Error(
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
	}

	private parseFetchedQuestions(
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
}