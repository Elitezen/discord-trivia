import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Collection,
    ComponentType,
    EmbedBuilder
} from "discord.js";

import Player from "./Player";
import { promisify } from "util";

import { Category, QuestionTypes, Util, getQuestions } from "open-trivia-db";

import {
    BooleanQuestion,
    MultipleChoiceQuestion
} from "./CustomQuestionBuilder";

import {
    buttonRowChoicesBoolean,
    buttonRowChoicesMultiple
} from "../components/buttons";

import { EventEmitter } from "events";
import {
    GameButtonIds,
    GameEvents,
    QueueCollectorEndReason
} from "../typings/enums";
import DefaultEmbeds from "./DefaultEmbeds";

import type { IncorrectAnswers, Question } from "open-trivia-db";
import type {
    ButtonInteraction,
    CacheType,
    CommandInteraction,
    GuildMember,
    InteractionCollector,
    Message,
    Snowflake,
    TextBasedChannel,
    User
} from "discord.js";

import type {
    GameConfig,
    GameData,
    GameMessageData,
    GameQuestion
} from "../typings/interfaces";

import type GameManager from "./GameManager";
import type { CustomQuestion } from "../typings/types";

const wait = promisify(setTimeout);

/**
 * Typings for `Game` events.
 * @interface
 */
declare interface Game {
    /**
     * Emitted when the game has ended.
     */
    on(event: "end", listener: (data: GameData) => void): this;

    /**
     * Emitted when the game is instantiated.
     */
    on(event: "pending", listener: () => void): this;

    /**
     * Emitted when a player joins the game.
     */
    on(event: "playerJoin", listener: (member: GuildMember) => void): this;

    /**
     * Emitted when a question is sent.
     */
    on(
        event: "questionEmit",
        listener: (question: GameQuestion, index: number) => void
    ): this;

    /**
     * Emitted when the game's queue has started.
     */
    on(event: "queue", listener: () => void): this;
}

/**
 * Represents a trivia game.
 * @extends {EventEmitter}
 * @implements {TriviaGame}
 */
class Game extends EventEmitter implements Game {
    private __CONFIG_DEFAULTS: GameConfig = {
        buttons: {
            join: new ButtonBuilder()
                .setCustomId(GameButtonIds.Join)
                .setLabel("Join")
                .setStyle(ButtonStyle.Primary),
            questionOptionA: new ButtonBuilder()
                .setCustomId(GameButtonIds.QuestionOptionA)
                .setLabel("A")
                .setStyle(ButtonStyle.Secondary),
            questionOptionB: new ButtonBuilder()
                .setCustomId(GameButtonIds.QuestionOptionB)
                .setLabel("B")
                .setStyle(ButtonStyle.Secondary),
            questionOptionC: new ButtonBuilder()
                .setCustomId(GameButtonIds.QuestionOptionC)
                .setLabel("C")
                .setStyle(ButtonStyle.Secondary),
            questionOptionD: new ButtonBuilder()
                .setCustomId(GameButtonIds.QuestionOptionD)
                .setLabel("D")
                .setStyle(ButtonStyle.Secondary),
            questionOptionTrue: new ButtonBuilder()
                .setCustomId(GameButtonIds.QuestionOptionTrue)
                .setLabel("True")
                .setStyle(ButtonStyle.Primary),
            questionOptionFalse: new ButtonBuilder()
                .setCustomId(GameButtonIds.QuestionOptionFalse)
                .setLabel("False")
                .setStyle(ButtonStyle.Danger)
        },

        embeds: {
            queue: () => DefaultEmbeds.gameQueue(this),
            playerJoin: (player: Player) =>
                DefaultEmbeds.playerJoin(player, this),
            gameStart: () => DefaultEmbeds.gameStart(this),
            gameQueueTimeout: () => DefaultEmbeds.gameQueueTimeout(),
            question: (question: GameQuestion) =>
                DefaultEmbeds.question(this, question),
            leaderboardUpdate: (lastQuestion: GameQuestion) =>
                DefaultEmbeds.leaderboardUpdate(lastQuestion, this),
            playerAlreadyAnswered: () => DefaultEmbeds.playerAlreadyAnswered(),
            playerAnsweredStats: (player: Player, timeElapsed: number) =>
                DefaultEmbeds.playerAnsweredStats(this, player, timeElapsed),
            playerNotInMatch: () => DefaultEmbeds.playerNotInMatch(),
            playerAlreadyQueued: () => DefaultEmbeds.playerAlreadyQueued(),
            filterReject: () => DefaultEmbeds.filterRejected(),
            gameEnd: () => DefaultEmbeds.gameEnd()
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
    };

    /**
     * This game's configuration
     * @type {GameConfig}
     */
    public config: GameConfig = this.__CONFIG_DEFAULTS;

    /**
     * The channel this game is hosted on.
     * @type {TextBasedChannel}
     * @readonly
     */
    public readonly channel: TextBasedChannel;

    /**
     * This game's leaderboard, a collection sorted by points descending.
     * @type {Collection<Snowflake, Player>}
     */
    public leaderboard: Collection<Snowflake, Player> = new Collection();

    /**
     * This game's manager.
     * @type {GameManager}
     * @readonly
     */
    public readonly manager: GameManager;

    /**
     * This game's players.
     * @type {Collection<Snowflake, Player>}
     * @readonly
     */
    public readonly players: Collection<Snowflake, Player> = new Collection();

    /**
     * The questions this game is serving.
     * @type {GameQuestion[]}
     */
    public questions: GameQuestion[] = [];

    /**
     * This game's message from which players can join the queue.
     * @type {Message | null}
     */
    public queueMessage: Message | null = null;

    /**
     * Whether this game has ended.
     */
    get ended(): boolean {
        return !this.manager.games.has(this.channel.id);
    }

    /**
     * Creates a new `Game` instance.
     * @param {GameManager} manager The manager this game will belong to.
     * @param {TextBasedChannel} channel The channel this game is hosted in.
     */
    constructor(manager: GameManager, channel: TextBasedChannel) {
        super();

        this.manager = manager;
        this.channel = channel;

        this.emit(GameEvents.Pending);
    }

    /**
     * Adds a player to this game.
     * @param {User} user The user to add.
     */
    async addPlayer(user: User) {
        this.players.set(user.id, new Player(this, user));

        if (this.queueMessage)
            this.queueMessage.edit({
                embeds: [this.config.embeds.queue([...this.players.values()])],
                components: [
                    new ActionRowBuilder<ButtonBuilder>().setComponents(
                        this.config.buttons.join
                    )
                ]
            });
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
     * Returns this game's current data.
     * @returns {GameData}
     */
    data(): GameData {
        const data = {
            questions: this.questions,
            timeEnd: Date.now(),
            players: this.leaderboard
        } satisfies GameData;

        return data;
    }

    /**
     * Ends this game.
     */
    end() {
        this.emit(GameEvents.End, this.data());
        this.manager.games.delete(this.channel.id);
        return this.data();
    }

    /**
     * Sends a question and awaits answers.
     * @param {GameQuestion} question The question emitted.
     * @private
     */
    private async emitQuestion(question: GameQuestion) {
        const {
            questionOptionA,
            questionOptionB,
            questionOptionC,
            questionOptionD,
            questionOptionFalse,
            questionOptionTrue
        } = this.config.buttons;
        return new Promise(async (resolve) => {
            let questionMessage = await this.channel.send({
                embeds: [this.config.embeds.question(question)],
                components: [
                    question.type === QuestionTypes.Multiple
                        ? buttonRowChoicesMultiple([
                              questionOptionA,
                              questionOptionB,
                              questionOptionC,
                              questionOptionD
                          ])
                        : buttonRowChoicesBoolean([
                              questionOptionTrue,
                              questionOptionFalse
                          ])
                ]
            });

            const emissionTime = Date.now();

            await this.handleMessageDelete(questionMessage, "question");

            const collector = questionMessage.createMessageComponentCollector({
                time: this.config.timePerQuestion,
                componentType: ComponentType.Button
            });

            collector.on("collect", async (i) => {
                let timeElapsed = Date.now() - emissionTime;
                if (timeElapsed > this.config.timePerQuestion) return;

                await this.handleAnswer(
                    i,
                    collector,
                    question,
                    questionMessage,
                    timeElapsed
                );
            });

            collector.on("end", async () => {
                await this.handleRoundEnd(question);
                resolve(0);
            });
        });
    }

    /**
     * Handles a new answer.
     * @param {ButtonInteraction<CacheType>} interaction
     * @param {GameQuestion} question
     * @param {number} timeElapsed
     * @private
     */
    private async handleAnswer(
        interaction: ButtonInteraction,
        collector:
            | InteractionCollector<ButtonInteraction<CacheType>>
            | InteractionCollector<ButtonInteraction<"cached">>,
        question: GameQuestion,
        embedMessage: Message<boolean>,
        timeElapsed: number
    ): Promise<void> {
        const player = this.players.get(interaction.user.id);
        if (!player) {
            return void interaction.reply({
                embeds: [this.config.embeds.playerNotInMatch(interaction.user)],
                ephemeral: true
            });
        } else if (player.hasAnswered) {
            return void interaction.reply({
                embeds: [this.config.embeds.playerAlreadyAnswered(player)],
                ephemeral: true
            });
        }

        await interaction.reply({
            embeds: [
                this.config.embeds.playerAnsweredStats(player, timeElapsed)
            ],
            ephemeral: true
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
                    ? new ActionRowBuilder<ButtonBuilder>().setComponents(
                          this.config.buttons.questionOptionA.setCustomId(
                              GameButtonIds.QuestionOptionA
                          ),
                          this.config.buttons.questionOptionB.setCustomId(
                              GameButtonIds.QuestionOptionB
                          ),
                          this.config.buttons.questionOptionC.setCustomId(
                              GameButtonIds.QuestionOptionC
                          ),
                          this.config.buttons.questionOptionD.setCustomId(
                              GameButtonIds.QuestionOptionD
                          )
                      )
                    : new ActionRowBuilder<ButtonBuilder>().setComponents(
                          this.config.buttons.questionOptionTrue.setCustomId(
                              GameButtonIds.QuestionOptionTrue
                          ),
                          this.config.buttons.questionOptionFalse.setCustomId(
                              GameButtonIds.QuestionOptionFalse
                          )
                      )
            ]
        });

        if (this.players.every((player) => player.hasAnswered))
            collector.stop();
    }

    /**
     * Verifies if a user is allowed to be admitted into the game.
     * @param {ButtonInteraction} interaction The interaction of the user.
     * @private
     */
    private async handleMemberJoinRequest(interaction: ButtonInteraction) {
        if (
            this.config.playerFilter &&
            !(await this.config.playerFilter(interaction.user))
        ) {
            return void interaction.reply({
                ephemeral: true,
                embeds: [this.config.embeds.filterReject(interaction.user)]
            });
        } else if (this.players.has(interaction.user.id)) {
            return void interaction.reply({
                ephemeral: true,
                embeds: [
                    this.config.embeds.playerAlreadyQueued(
                        this.players.get(interaction.user.id)!
                    )
                ]
            });
        }

        this.addPlayer(interaction.user);

        this.emit(GameEvents.PlayerJoin);

        await interaction.reply({
            ephemeral: true,
            embeds: [
                this.config.embeds.playerJoin(
                    this.players.get(interaction.user.id)!
                )
            ]
        });
    }

    /**
     * Assigns a timeout function which will delete the provided message.
     * @param {Message} message The message to be deleted.
     * @param {string} key
     * @private
     */
    private async handleMessageDelete(
        message: Message,
        key: keyof GameMessageData
    ) {
        const messageDeleterData = this.config.messageDeleter[key];

        if (messageDeleterData !== null && message.deletable) {
            setTimeout(async () => {
                try {
                    await message.delete();
                } catch (err) {
                    console.warn(err);
                }
            }, messageDeleterData);
        }
    }

    /**
     * Called whenever the game does not meet the minimum requirements set in `Game.config`.
     * @private
     */
    private async handleQueueTimeout() {
        try {
            if (this.queueMessage && this.queueMessage.editable) {
                await this.queueMessage.edit({
                    embeds: [
                        EmbedBuilder.from(
                            this.queueMessage.embeds[0]
                        ).setFooter({
                            text: "This queue has expired"
                        })
                    ],
                    components: [
                        new ActionRowBuilder<ButtonBuilder>().setComponents(
                            this.config.buttons.join.setDisabled(true)
                        )
                    ]
                });
            }

            await this.channel.send({
                embeds: [this.config.embeds.gameQueueTimeout()]
            });
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * Handles the end of the round.
     * @param {GameQuestion} question The recent question.
     * @private
     */
    private async handleRoundEnd(question: GameQuestion): Promise<void> {
        this.leaderboard = this.leaderboard.sort((a, b) => b.points - a.points);

        const msg = await this.channel.send({
            embeds: [this.config.embeds.leaderboardUpdate(question)]
        });

        await this.handleMessageDelete(msg, "leaderboardUpdate");
        await this.prepareNextRound();
        await wait(this.config.timeBetweenRounds);
    }

    /**
     * Begins the game
     * @private
     */
    private async initializeGame() {
        this.leaderboard = this.players;
        let fetchedQuestions: Question[] = [];
        let customQuestions: (
            | CustomQuestion<QuestionTypes>
            | MultipleChoiceQuestion
            | BooleanQuestion
        )[] = [];

        if (this.config.fetchQuestionsOptions.amount > 0) {
            if (typeof this.config.fetchQuestionsOptions.category == "string") {
                const targetCategoryId = Category.idByName(
                    this.config.fetchQuestionsOptions.category
                );
                if (targetCategoryId === null) {
                    throw new Error(
                        `Provided category (${this.config.fetchQuestionsOptions.category}) is not a valid OpenTDB category.`
                    );
                }

                this.config.fetchQuestionsOptions.category = targetCategoryId;
            }

            fetchedQuestions = await getQuestions(
                this.config.fetchQuestionsOptions
            );
        }

        if (this.config.customQuestions.length) {
            customQuestions = this.config.customQuestions;
        }

        this.questions = [
            ...this.parseFetchedQuestions(fetchedQuestions),
            ...this.parseCustomQuestions(customQuestions)
        ];

        if (!this.questions.length)
            throw new Error(
                "This game has no questions loaded. Provide an amount for fetched questions or supply custom questions."
            );

        const gameStartMessage = await this.channel.send({
            embeds: [this.config.embeds.gameStart()]
        });

        await this.handleMessageDelete(gameStartMessage, "gameStart");
        await wait(this.config.timeBetweenRounds);

        await this.startGameCycle();
    }

    /**
     * Converts a raw question into a game question.
     * @param {(CustomQuestion<QuestionTypes> | BooleanQuestion | MultipleChoiceQuestion)[]} questions The questions to parse.
     * @private
     */
    private parseCustomQuestions(
        questions: (
            | CustomQuestion<QuestionTypes>
            | BooleanQuestion
            | MultipleChoiceQuestion
        )[]
    ) {
        return questions.map((q) => {
            const isBuilder =
                q instanceof BooleanQuestion ||
                q instanceof MultipleChoiceQuestion;
            const _q = isBuilder ? q.data : q;

            if (!_q.value)
                throw new Error(
                    "Custom Question is missing required property .value"
                );
            if (!_q.type)
                throw new Error(
                    "Custom Question is missing required property .type"
                );
            if (!_q.correctAnswer)
                throw new Error(
                    "Custom Question is missing required property correctAnswer"
                );
            if (!_q.incorrectAnswers)
                throw new Error(
                    "Custom Question is missing required property incorrectAnswers"
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
                              ...(_q.incorrectAnswers as IncorrectAnswers)
                          ]),
                checkAnswer: function (str: string) {
                    return (
                        str.toLowerCase() === this.correctAnswer.toLowerCase()
                    );
                }
            };
        });
    }

    /**
     * Parses `open-trivia-db` package question into a game question
     * @param {(Question<unknown> | GameQuestion)[]} qs The questions to parse.
     * @private
     */
    private parseFetchedQuestions(
        qs: (Question<unknown> | GameQuestion)[]
    ): GameQuestion[] {
        return qs.map((q) => {
            return {
                value: q.value,
                category:
                    typeof q.category === "string"
                        ? q.category
                        : q.category.name,
                difficulty: q.difficulty,
                correctAnswer: q.correctAnswer,
                incorrectAnswers: q.incorrectAnswers,
                allAnswers:
                    q.type === QuestionTypes.Boolean
                        ? ["true", "false"]
                        : Util.shuffleArray([
                              q.correctAnswer,
                              ...q.incorrectAnswers
                          ]),
                type:
                    q.type === "boolean"
                        ? QuestionTypes.Boolean
                        : QuestionTypes.Multiple,
                checkAnswer: (str) => str === q.correctAnswer
            };
        });
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

    /**
     * Begins the rounds cycle.
     * @private
     */
    private async startGameCycle() {
        let i = 0;
        for await (const question of this.questions) {
            if (this.ended) break;

            this.emit(GameEvents.QuestionEmit, question, i);

            await this.emitQuestion(question);
            await wait(this.config.timeBetweenQuestions);

            ++i;
        }

        this.end();

        await this.channel.send({
            embeds: [this.config.embeds.gameEnd(this.leaderboard)]
        });
    }

    /**
     * Begins this game's queue.
     * @param {CommandInteraction?} interaction The interaction that triggered the queue, if any.
     */
    async startQueue(interaction?: CommandInteraction): Promise<void> {
        this.emit(GameEvents.Queue);

        if (this.manager.games.has(this.channel.id))
            throw "There cannot be 2 ongoing games in the same channel";
        this.manager.games.set(this.channel.id, this);

        try {
            let queueMessage: Message;

            if (interaction) {
                queueMessage = await interaction.reply({
                    embeds: [this.config.embeds.queue()],
                    components: [
                        new ActionRowBuilder<ButtonBuilder>().setComponents(
                            this.config.buttons.join.setCustomId(
                                GameButtonIds.Join
                            )
                        )
                    ],
                    fetchReply: true
                });
            } else {
                queueMessage = await this.channel.send({
                    embeds: [this.config.embeds.queue()],
                    components: [
                        new ActionRowBuilder<ButtonBuilder>().setComponents(
                            this.config.buttons.join.setCustomId(
                                GameButtonIds.Join
                            )
                        )
                    ]
                });
            }

            await this.handleMessageDelete(queueMessage, "queue");
            await this.queueListener(queueMessage);
            this.queueMessage = queueMessage;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Creates a listener for the queue buttons.
     * @param {Message} message The message that contains the buttons.
     * @private
     */
    private async queueListener(message: Message) {
        const collector = message.createMessageComponentCollector({
            time: this.config.queueDuration,
            componentType: ComponentType.Button,
            max: this.config.maxPlayerCount
        });

        collector.on("collect", async (interaction) => {
            if (interaction.customId !== GameButtonIds.Join) {
                return console.error(
                    `Recieved Unrecognized Button Interaction Custom ID "${interaction.customId}"`
                );
            }

            try {
                await this.handleMemberJoinRequest(interaction);
                if (this.players.size === this.config.maxPlayerCount)
                    collector.stop(QueueCollectorEndReason.MaxPlayersReached);
            } catch (err) {
                throw err;
            }
        });

        collector.on("end", async () => {
            const enoughPlayers =
                this.players.size >= this.config.minPlayerCount;
            const maxPlayersReached =
                collector.endReason ===
                QueueCollectorEndReason.MaxPlayersReached;

            if (!maxPlayersReached && !enoughPlayers)
                return this.handleQueueTimeout();

            try {
                await this.initializeGame();
            } catch (err) {
                throw err;
            }
        });
    }
}

export default Game;
