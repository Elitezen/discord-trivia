import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import {
  CategoryNameResolvable,
  Question,
  QuestionDifficulty,
  QuestionType,
} from "open-trivia-db";
import {
  QuestionData,
  TriviaCommandBuilderOptions,
  TriviaGameOptions,
} from "../Typings/interfaces";
import TriviaGame from "./TriviaGame";

export default class TriviaCommandBuilder {
  private build: SlashCommandBuilder;
  public gameOptions: TriviaGameOptions = TriviaGame.defaults;
  private isApplied: Boolean = false;

  constructor(options?: TriviaCommandBuilderOptions) {
    this.build = new SlashCommandBuilder()
      .setName(options?.name ?? "trivia")
      .setDescription(options?.description ?? "Create a trivia game.");
  }

  private optionApplicators = {
    maximumPlayerCount: () => {
      this.build.addIntegerOption((opt) =>
        opt
          .setName("maximum_player_count")
          .setDescription(
            "The maximum amount of players allowed to join this match"
          )
          .setRequired(false)
      );
    },
    maximumPoints: () => {
      this.build.addIntegerOption((opt) =>
        opt
          .setName("maximum_points")
          .setDescription(
            "The maximum amount of points a player can earn per question"
          )
          .setRequired(false)
      );
    },
    minimumPlayerCount: () => {
      this.build.addIntegerOption((opt) =>
        opt
          .setName("minimum_player_count")
          .setDescription(
            "The minimum amount of players required to start the match"
          )
          .setRequired(false)
      );
    },
    minimumPoints: () => {
      this.build.addIntegerOption((opt) =>
        opt
          .setName("minimum_points")
          .setDescription(
            "The minimum amount of points a player can earn per question"
          )
          .setRequired(false)
      );
    },
    questionAmount: () => {
      this.build.addIntegerOption((opt) =>
        opt
          .setName("question_amount")
          .setDescription("The number of questions")
          .setRequired(false)
      );
    },
    questionDifficulty: () => {
      this.build.addStringOption((opt) =>
        opt
          .setName("question_difficulty")
          .setDescription("The difficulty all questions should be")
          .addChoices(
            { name: "Easy", value: "easy" },
            { name: "Medium", value: "medium" },
            { name: "Hard", value: "hard" }
          )
          .setRequired(false)
      );
    },
    questionType: () => {
      this.build.addStringOption((opt) =>
        opt
          .setName("question_type")
          .setDescription("The question type for all questions")
          .addChoices(
            { name: "Multiple Choice", value: "multiple" },
            { name: "false/False", value: "boolean" }
          )
          .setRequired(false)
      );
    },
    queueTime: () => {
      this.build.addIntegerOption((opt) =>
        opt
          .setName("queue_time")
          .setDescription("How long to await players before starting the match")
          .setRequired(false)
      );
    },
    timePerQuestion: () => {
      this.build.addIntegerOption((opt) =>
        opt
          .setName("time_per_question")
          .setDescription("How long each round should last (in milliseconds)")
          .setRequired(false)
      );
    },
    triviaCategory: () => {
      this.build.addStringOption((opt) =>
        opt
          .setName("category")
          .setDescription("The category for the questions")
          .addChoices(
            { name: "General Knowledge", value: "9" },
            { name: "Entertainment: Books", value: "10" },
            { name: "Entertainment: Film", value: "11" },
            { name: "Entertainment: Music", value: "12" },
            { name: "Entertainment: Musicals and Theatres", value: "13" },
            { name: "Entertainment: Television", value: "14" },
            { name: "Entertainment: Video Games", value: "15" },
            { name: "Entertainment: Board Games", value: "16" },
            { name: "Science and Nature", value: "17" },
            { name: "Science: Computers", value: "18" },
            { name: "Science Mathematics", value: "19" },
            { name: "Mythology", value: "20" },
            { name: "Sports", value: "21" },
            { name: "Geography", value: "22" },
            { name: "History", value: "23" },
            { name: "Politics", value: "24" },
            { name: "Art", value: "25" },
            { name: "Celebrities", value: "26" },
            { name: "Animals", value: "27" },
            { name: "Vehicles", value: "28" },
            { name: "Entertainment: Comics", value: "29" },
            { name: "Science: Gadgets", value: "30" },
            { name: "Entertainment: Japanese Anime and Manga", value: "31" },
            { name: "Entertainment: Cartoon and Animations", value: "32" }
          )
          .setRequired(false)
      );
    },
    timeBetweenRounds: () => {
      this.build.addIntegerOption((opt) =>
        opt
          .setName("time_between_rounds")
          .setDescription("How long to wait between rounds in ms")
          .setRequired(false)
      );
    },
    pointsPerStreakAmount: () => {
      this.build.addIntegerOption((opt) =>
        opt
          .setName("points_per_streak")
          .setDescription(
            "How many bonus points to award per streak accumulation"
          )
          .setRequired(false)
      );
    },
    maximumStreakBonus: () => {
      this.build.addIntegerOption((opt) =>
        opt
          .setName("max_streak_bonus")
          .setDescription("Maximum bonus for accumulated streaks")
          .setRequired(false)
      );
    },
    streakDefinitionLevel: () => {
      this.build.addIntegerOption((opt) =>
        opt
          .setName("streak_level")
          .setDescription("At which consecutive correct answer to start streak")
          .setRequired(false)
      );
    },
  };

  private applyOptions() {
    Object.values(this.optionApplicators).forEach((func) => func());
  }

  toJSON() {
    if (!this.isApplied) {
      this.applyOptions();
      this.isApplied = false;
    }
    return this.build.toJSON();
  }

  toBuilder() {
    if (!this.isApplied) {
      this.applyOptions();
      this.isApplied = false;
    }
    return this.build;
  }

  getOptions(
    int: CommandInteraction,
    additionalOptions?: Partial<TriviaGameOptions>
  ) {
    const maximumPlayerCount = int.options.get("maximum_player_count", false)
      ?.value as number;
    const maximumPoints = int.options.get("maximum_points", false)
      ?.value as number;
    const minimumPlayerCount = int.options.get("minimum_player_count", false)
      ?.value as number;
    const minimumPoints = int.options.get("minimum_points", false)
      ?.value as number;
    const questionAmount = int.options.get("question_amount", false)
      ?.value as number;
    const questionDifficulty = int.options.get("question_difficulty", false)
      ?.value as QuestionDifficulty;
    const questionType = int.options.get("question_type", false)
      ?.value as QuestionType;
    const queueTime = int.options.get("queue_time", false)?.value as number;
    const timePerQuestion = int.options.get("time_per_question", false)
      ?.value as number;
    const triviaCategory = int.options.get("category", false)
      ?.value as CategoryNameResolvable;
    const timeBetweenRounds = int.options.get("time_between_rounds", false)
      ?.value as number;
    const pointsPerStreakAmount = int.options.get("points_per_streak", false)
      ?.value as number;
    const maximumStreakBonus = int.options.get("max_streak_bonus", false)
      ?.value as number;
    const streakDefinitionLevel = int.options.get("streak_level", false)
      ?.value as number;

    let options: TriviaGameOptions = {} as TriviaGameOptions;
    options.maximumPlayerCount =
      maximumPlayerCount || TriviaGame.defaults.maximumPlayerCount;
    options.maximumPoints = maximumPoints || TriviaGame.defaults.maximumPoints;
    options.minimumPlayerCount =
      minimumPlayerCount || TriviaGame.defaults.minimumPlayerCount;
    options.minimumPlayerCount =
      minimumPlayerCount || TriviaGame.defaults.minimumPlayerCount;
    options.minimumPoints = minimumPoints || TriviaGame.defaults.minimumPoints;

    if (!Array.isArray(options.questionData)) {
      options.questionData = {} as QuestionData;
      options.questionData.amount =
        questionAmount ||
        (TriviaGame.defaults.questionData as QuestionData).amount;
      options.questionData.difficulty = (questionDifficulty ||
        (TriviaGame.defaults.questionData as QuestionData)
          .difficulty) as QuestionDifficulty;
      options.questionData.type = (questionType ||
        (TriviaGame.defaults.questionData as QuestionData)
          .type) as QuestionType;
      options.queueTime = queueTime || TriviaGame.defaults.queueTime;
      options.timePerQuestion =
        timePerQuestion || TriviaGame.defaults.timePerQuestion;
      options.questionData.category =
        triviaCategory ||
        (TriviaGame.defaults.questionData as QuestionData).category;
    }

    options.timeBetweenRounds =
      timeBetweenRounds || TriviaGame.defaults.timeBetweenRounds;
    options.pointsPerStreakAmount =
      pointsPerStreakAmount || TriviaGame.defaults.pointsPerStreakAmount;
    options.maximumStreakBonus =
      maximumStreakBonus || TriviaGame.defaults.maximumStreakBonus;
    options.streakDefinitionLevel =
      streakDefinitionLevel || TriviaGame.defaults.streakDefinitionLevel;

    if (additionalOptions) Object.assign(options, additionalOptions);

    return options;
  }
}
