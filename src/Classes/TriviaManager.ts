import {
  ChannelType,
  Collection,
  CommandInteraction,
  InteractionType,
  Message,
} from "discord.js";
import { TriviaGameOptions, TriviaManagerOptions } from "../Typings/interfaces";
import { TriviaManagerGames } from "../Typings/types";
import DiscordTriviaError from "./DiscordTriviaError";
import RootComponent from "./RootComponent";
import TriviaGame from "./TriviaGame";
import constants from "../../constants";

/**
 * @class Class for creating and managing ongiong games.
 */
export default class TriviaManager {
  public readonly games: TriviaManagerGames = new Collection();
  public readonly options: TriviaManagerOptions;
  public static readonly defaults: TriviaManagerOptions = {
    theme: "Blurple",
    showAnswers: true,
    image: constants.libraryDefaults.defaultEmbedImage,
  };

  constructor(options?: TriviaManagerOptions) {
    this.options = options
      ? Object.assign(TriviaManager.defaults, options)
      : TriviaManager.defaults;
  }

  /**
   * Returns an instance of a TriviaGame
   * @param {CommandInteraction} interaction - The interaction to assign to the game.
   * @param {Partial<TriviaGameOptions>?} options - The configuration options to assign to the game (optional)
   */
  createGame(
    root: CommandInteraction | Message,
    options?: Partial<TriviaGameOptions>
  ): TriviaGame {
    const component = new RootComponent(root);

    if (this.games.has(component.channel.id)) {
      const errorMessage = "There's already an ongoing game in this channel";
      component.reply[component.type]({
        content: errorMessage,
        ephemeral: true,
      });

      throw new DiscordTriviaError(errorMessage, "ONGOING_GAME");
    }

    return new TriviaGame(component, this, options);
  }

  public validator = {
    validateDiscordStructures(game: TriviaGame) {
      if (game.guild === null) {
        const { message, header } = DiscordTriviaError.errors.guildNullish;
        throw new DiscordTriviaError(message, header);
      } else if (game.channel === null) {
        const { message, header } = DiscordTriviaError.errors.channelNullish;
        throw new DiscordTriviaError(message, header);
      } else if (game.channel.type != ChannelType.GuildText) {
        // game.channel.type (:ChannelType.GuildText) != ChannelType.GuildText always returns true
        const { message, header } = DiscordTriviaError.errors.channelNonText;
        throw new DiscordTriviaError(message, header);
      }
    },

    validatePlayerCount(
      label: "minimumPlayerCount" | "maximumPlayerCount",
      val: unknown
    ) {
      if (!val && val != 0) {
        throw new DiscordTriviaError(
          `A ${label} option for TriviaGameOptions is required`,
          "MISSING_OPTION"
        );
      } else if (typeof val != "number" && typeof val != "string") {
        throw new DiscordTriviaError(
          `The ${label} option for TriviaGameOptions must be of type number or string`,
          "INVALID_OPTION"
        );
      } else if (isNaN(+val)) {
        throw new DiscordTriviaError(
          `The ${label} option for TriviaGameOptions must be a number resolvable`,
          "INVALID_OPTION"
        );
      } else if (+val % 1 !== 0) {
        throw new DiscordTriviaError(
          `The ${label} option for TriviaGameOptions must be a whole integer`,
          "INVALID_OPTION"
        );
      } else if (+val < 1) {
        throw new DiscordTriviaError(
          `The ${label} option for TriviaGameOptions must be greater than or equal to 1`,
          "INVALID_OPTION"
        );
      }
    },

    checkPlayerCountRelation(min: number, max: number) {
      if (min > max)
        throw new DiscordTriviaError(
          "The maximumPlayerCount option for TriviaGameOptions cannot be less than the minimumPlayerCountOption",
          "INVALID_OPTION"
        );
    },

    validatePointRange(label: "minPoints" | "maxPoints", val: unknown) {
      if (!val && val != 0) {
        throw new DiscordTriviaError(
          `A ${label} option for TriviaGameOptions is required`,
          "MISSING_OPTION"
        );
      } else if (typeof val != "number" && typeof val != "string") {
        throw new DiscordTriviaError(
          `The ${label} option for TriviaGameOptions must be of type number or string`,
          "INVALID_OPTION"
        );
      } else if (isNaN(+val)) {
        throw new DiscordTriviaError(
          `The ${label} option for TriviaGameOptions must be a number resolvable`,
          "INVALID_OPTION"
        );
      } else if (+val % 1 !== 0) {
        throw new DiscordTriviaError(
          `The ${label} option for TriviaGameOptions must be a whole integer`,
          "INVALID_OPTION"
        );
      } else if (+val < 1) {
        throw new DiscordTriviaError(
          `The ${label} option for TriviaGameOptions must be greater than or equal to 1`,
          "INVALID_OPTION"
        );
      }
    },

    checkPointRangeRelation(min: number, max: number) {
      if (min > max)
        throw new DiscordTriviaError(
          "The maxPoints option for TriviaGameOptions cannot be less than the minPoints",
          "INVALID_OPTION"
        );
    },

    validateTimePerQuestion(val: unknown) {
      if (!val && val != 0) {
        throw new DiscordTriviaError(
          `A timePerQuestion option for TriviaGameOptions is required`,
          "MISSING_OPTION"
        );
      } else if (typeof val != "number" && typeof val != "string") {
        throw new DiscordTriviaError(
          "The timePerQuestion option for TriviaGameOptions must be of type number or string",
          "INVALID_OPTION"
        );
      } else if (isNaN(+val)) {
        throw new DiscordTriviaError(
          "The timePerQuestion option for TriviaGameOptions must be a number resolvable",
          "INVALID_OPTION"
        );
      } else if (+val % 1 !== 0) {
        throw new DiscordTriviaError(
          "The timePerQuestion option for TriviaGameOptions must be a whole integer",
          "INVALID_OPTION"
        );
      } else if (+val < 1_000) {
        throw new DiscordTriviaError(
          "The timePerQuestion option for TriviaGameOptions must be greater than or equal to 1000ms",
          "INVALID_OPTION"
        );
      }
    },

    validateQuestionAmount(val: unknown) {
      if (!val && val != 0) {
        throw new DiscordTriviaError(
          `An amount option for TriviaGameOptions.questionData is required`,
          "MISSING_OPTION"
        );
      } else if (typeof val != "number" && typeof val != "string") {
        throw new DiscordTriviaError(
          "The amount option for TriviaGameOptions.questionData must be of type number or string",
          "INVALID_OPTION"
        );
      } else if (isNaN(+val)) {
        throw new DiscordTriviaError(
          "The amount option for TriviaGameOptions.questionData must be a number resolvable",
          "INVALID_OPTION"
        );
      } else if (+val % 1 !== 0) {
        throw new DiscordTriviaError(
          "The amount option for TriviaGameOptions.questionData must be a whole integer",
          "INVALID_OPTION"
        );
      } else if (+val < 1) {
        throw new DiscordTriviaError(
          "The amount option for TriviaGameOptions.questionData must be greater than or equal to 1",
          "INVALID_OPTION"
        );
      }
    },

    validateQuestionDifficulty(val: unknown) {
      if (val === null) return;

      if (!val) {
        throw new DiscordTriviaError(
          `A difficulty option for TriviaGameOptions.questionData is required`,
          "MISSING_OPTION"
        );
      } else if (typeof val != "string") {
        throw new DiscordTriviaError(
          `The difficulty option for TriviaGameOptions.questionData must be a string`,
          "INVALID_OPTION"
        );
      } else if (!["easy", "medium", "hard"].includes(val.toLowerCase())) {
        throw new DiscordTriviaError(
          `Supplied difficulty option (${val}) is not a difficulty resolvable`,
          "INVALID_OPTION"
        );
      }
    },

    validateQuestionType(val: unknown) {
      if (val === null) return;

      if (!val) {
        throw new DiscordTriviaError(
          `A type option for TriviaGameOptions.questionData is required`,
          "MISSING_OPTION"
        );
      } else if (typeof val != "string") {
        throw new DiscordTriviaError(
          `The type option for TriviaGameOptions.questionData must be a string`,
          "INVALID_OPTION"
        );
      } else if (!["multiple", "boolean"].includes(val.toLowerCase())) {
        throw new DiscordTriviaError(
          `Supplied type option (${val}) is not a type resolvable`,
          "INVALID_OPTION"
        );
      }
    },

    validateQueueTime(val: unknown) {
      if (!val && val != 0) {
        throw new DiscordTriviaError(
          `A queueTime option for TriviaGameOptions is required`,
          "MISSING_OPTION"
        );
      } else if (typeof val != "number" && typeof val != "string") {
        throw new DiscordTriviaError(
          "The queueTime option for TriviaGameOptions must be of type number or string",
          "INVALID_OPTION"
        );
      } else if (isNaN(+val)) {
        throw new DiscordTriviaError(
          "The queueTime option for TriviaGameOptions must be a number resolvable",
          "INVALID_OPTION"
        );
      } else if (+val % 1 !== 0) {
        throw new DiscordTriviaError(
          "The queueTime option for TriviaGameOptions must be a whole integer",
          "INVALID_OPTION"
        );
      } else if (+val < 1_000) {
        throw new DiscordTriviaError(
          "The queueTime option for TriviaGameOptions must be greater than or equal to 1000ms",
          "INVALID_OPTION"
        );
      }
    },

    validatePointsPerStreakAmount(val: unknown) {
      if (!val) {
        throw new DiscordTriviaError(
          `A pointsPerStreakAmount option for TriviaGameOptions is required`,
          "MISSING_OPTION"
        );
      } else if (typeof val != "number" && typeof val != "string") {
        throw new DiscordTriviaError(
          "The pointsPerStreakAmount option for TriviaGameOptions must be of type number or string",
          "INVALID_OPTION"
        );
      } else if (isNaN(+val)) {
        throw new DiscordTriviaError(
          "The pointsPerStreakAmount option for TriviaGameOptions must be a number resolvable",
          "INVALID_OPTION"
        );
      } else if (+val % 1 !== 0) {
        throw new DiscordTriviaError(
          "The pointsPerStreakAmount option for TriviaGameOptions must be a whole integer",
          "INVALID_OPTION"
        );
      } else if (+val < 0) {
        throw new DiscordTriviaError(
          "The pointsPerStreakAmount option for TriviaGameOptions must be greater than or equal to 0",
          "INVALID_OPTION"
        );
      }
    },

    validateMaximumStreakBonus(val: unknown) {
      if (!val && val != 0) {
        throw new DiscordTriviaError(
          `A maximumStreakBonus option for TriviaGameOptions is required`,
          "MISSING_OPTION"
        );
      } else if (typeof val != "number" && typeof val != "string") {
        throw new DiscordTriviaError(
          "The maximumStreakBonus option for TriviaGameOptions must be of type number or string",
          "INVALID_OPTION"
        );
      } else if (isNaN(+val)) {
        throw new DiscordTriviaError(
          "The maximumStreakBonus option for TriviaGameOptions must be a number resolvable",
          "INVALID_OPTION"
        );
      } else if (+val % 1 !== 0) {
        throw new DiscordTriviaError(
          "The maximumStreakBonus option for TriviaGameOptions must be a whole integer",
          "INVALID_OPTION"
        );
      } else if (+val < 0) {
        throw new DiscordTriviaError(
          "The maximumStreakBonus option for TriviaGameOptions must be greater than or equal to 0",
          "INVALID_OPTION"
        );
      }
    },

    validateGameOptions(obj: TriviaGameOptions): void {
      if (Array.isArray(obj.questionData)) return;

      try {
        this.validatePlayerCount("minimumPlayerCount", obj.minimumPlayerCount);
        this.validatePlayerCount("maximumPlayerCount", obj.maximumPlayerCount);
        this.validatePointRange("maxPoints", obj.maximumPoints);
        this.validatePointRange("minPoints", obj.minimumPoints);

        this.checkPlayerCountRelation(
          obj.minimumPlayerCount!,
          obj.maximumPlayerCount!
        );

        this.checkPointRangeRelation(obj.minimumPoints!, obj.maximumPoints!);

        const { difficulty, amount, type } = obj.questionData;

        this.validateTimePerQuestion(obj.timePerQuestion);
        difficulty !== null && this.validateQuestionDifficulty(difficulty);
        this.validateQuestionAmount(amount);
        type !== null && this.validateQuestionType(type);
        this.validateQueueTime(obj.queueTime);
        this.validatePointsPerStreakAmount(obj.pointsPerStreakAmount);
        this.validateMaximumStreakBonus(obj.maximumStreakBonus);
      } catch (err) {
        throw err;
      }
    },
  };
}
