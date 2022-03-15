import { SlashCommandBuilder } from "@discordjs/builders";
import { ApplicationCommandData } from "discord.js";
import {
  LockedGameOptionsEntry,
  TriviaCommandBuilderOptions,
  TriviaGameOptions,
} from "../Typings/interfaces";
import { LockedOptionApplier, TriviaGameOptionKeys } from "../Typings/types";
import TriviaGame from "./TriviaGame";

export default class TriviaCommandBuilder {
  private build!: SlashCommandBuilder;
  public gameOptions!: TriviaGameOptions;
  private lockedGameOptionsData: LockedGameOptionsEntry[] = [];
  private isApplied: Boolean = false;

  constructor(options?: TriviaCommandBuilderOptions) {
    this.build = new SlashCommandBuilder()
      .setName(options?.name ?? "trivia")
      .setDescription(options?.description ?? "Create a trivia game.");
  }

  private optionApplicators: LockedOptionApplier = {
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
  };

  private applyOptions() {
    const toApply = Object.keys(TriviaGame.defaults).filter(
      (optionName) =>
        !this.lockedGameOptionsData.some(
          (entry) => entry.optionName == optionName
        )
    );
    toApply.forEach((optionName) => {
      this.optionApplicators[optionName as TriviaGameOptionKeys]();
    });
  }

  lockGameOption(entry: LockedGameOptionsEntry) {
    this.lockedGameOptionsData.push(entry);

    // Short-circuiting object indexing type check
    (this.gameOptions[entry.optionName] as unknown) = entry.value;
    return this;
  }

  lockGameOptions(entries: LockedGameOptionsEntry[]) {
    entries.forEach((e) => {
      this.lockedGameOptionsData.push(e);

      // Short-circuiting object indexing type check
      (this.gameOptions[e.optionName] as unknown) = e.value;
    });
    return this;
  }

  // Returns incompatible with RESTPostAPIApplicationCommandsJSONBody
  toJSON() { //If its toData() users command handlers probably will use toJSON() so it will throw an error
    if(!this.isApplied){ 
      this.applyOptions();
      this.isApplied = true;
    }
    return this.build.toJSON();
  }

  toBuilder() {
    if(!this.isApplied){ 
      this.applyOptions();
      this.isApplied = true;
    }
    return this.build;
  }
}
