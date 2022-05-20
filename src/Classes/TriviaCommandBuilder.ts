import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Question, QuestionDifficulty, QuestionType } from "open-trivia-db";
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
          .addChoices([
            ["Easy", "easy"],
            ["Medium", "medium"],
            ["Hard", "hard"],
          ])
          .setRequired(false)
      );
    },
    questionType: () => {
      this.build.addStringOption((opt) =>
        opt
          .setName("question_type")
          .setDescription("The question type for all questions")
          .addChoices([
            ["Multiple Choice", "multiple"],
            ["True/False", "boolean"],
          ])
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
          .addChoices([
            ["General Knowledge", "9"],
            ["Entertainment: Books", "10"],
            ["Entertainment: Film", "11"],
            ["Entertainment: Music", "12"],
            ["Entertainment: Musicals and Theatres", "13"],
            ["Entertainment: Television", "14"],
            ["Entertainment: Video Games", "15"],
            ["Entertainment: Board Games", "16"],
            ["Science and Nature", "17"],
            ["Science: Computers", "18"],
            ["Science Mathematics", "19"],
            ["Mythology", "20"],
            ["Sports", "21"],
            ["Geography", "22"],
            ["History", "23"],
            ["Politics", "24"],
            ["Art", "25"],
            ["Celebrities", "26"],
            ["Animals", "27"],
            ["Vehicles", "28"],
            ["Entertainment: Comics", "29"],
            ["Science: Gadgets", "30"],
            ["Entertainment: Japanese Anime and Manga", "31"],
            ["Entertainment: Cartoon and Animations", "32"],
          ])
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
      this.isApplied = true;
    }
    return this.build.toJSON();
  }

  toBuilder() {
    if (!this.isApplied) {
      this.applyOptions();
      this.isApplied = true;
    }
    return this.build;
  }

  getOptions(
    int: CommandInteraction,
    additionalOptions?: Partial<TriviaGameOptions>
  ) {
    const maximumPlayerCount = int.options.getInteger("maximum_player_count");
    const maximumPoints = int.options.getInteger("maximum_points");
    const minimumPlayerCount = int.options.getInteger("minimum_player_count");
    const minimumPoints = int.options.getInteger("minimum_points");
    const questionAmount = int.options.getInteger("question_amount");
    const questionDifficulty = int.options.getString("question_difficulty");
    const questionType = int.options.getString("question_type");
    const queueTime = int.options.getInteger("queue_time");
    const timePerQuestion = int.options.getInteger("time_per_question");
    const triviaCategory = int.options.getString("category");
    const timeBetweenRounds = int.options.getInteger("time_between_rounds");
    const pointsPerStreakAmount = int.options.getInteger("points_per_streak");
    const maximumStreakBonus = int.options.getInteger("max_streak_bonus");
    const streakDefinitionLevel = int.options.getInteger("streak_level");

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
