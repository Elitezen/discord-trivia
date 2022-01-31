import DiscordTriviaError from "../../Classes/DiscordTriviaError";
import { TriviaGameOptions } from "../../Typings/interfaces";

function validatePlayerCount(
  label: "minPlayerCount" | "maxPlayerCount",
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
}

function checkPlayerCountRelation(min: number, max: number) {
  if (min > max)
    throw new DiscordTriviaError(
      "The maxPlayerCount option for TriviaGameOptions cannot be less than the minPlayerCountOption",
      "INVALID_OPTION"
    );
}

function validateTimePerQuestion(val: unknown) {
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
}

function validateQuestionAmount(val: unknown) {
  if (!val && val != 0) {
    throw new DiscordTriviaError(
      `A questionAmount option for TriviaGameOptions is required`,
      "MISSING_OPTION"
    );
  } else if (typeof val != "number" && typeof val != "string") {
    throw new DiscordTriviaError(
      "The questionAmount option for TriviaGameOptions must be of type number or string",
      "INVALID_OPTION"
    );
  } else if (isNaN(+val)) {
    throw new DiscordTriviaError(
      "The questionAmount option for TriviaGameOptions must be a number resolvable",
      "INVALID_OPTION"
    );
  } else if (+val % 1 !== 0) {
    throw new DiscordTriviaError(
      "The questionAmount option for TriviaGameOptions must be a whole integer",
      "INVALID_OPTION"
    );
  } else if (+val < 1) {
    throw new DiscordTriviaError(
      "The questionAmount option for TriviaGameOptions must be greater than or equal to 1",
      "INVALID_OPTION"
    );
  }
}

function validateQuestionDifficulty(val: unknown) {
  if (val === null) return;

  if (!val) {
    throw new DiscordTriviaError(
      `A questionDifficulty option for TriviaGameOptions is required`,
      "MISSING_OPTION"
    );
  } else if (typeof val != "string") {
    throw new DiscordTriviaError(
      `The questionDifficulty option for TriviaGameOptions must be a string`,
      "INVALID_OPTION"
    );
  } else if (!["easy", "medium", "hard"].includes(val.toLowerCase())) {
    throw new DiscordTriviaError(
      `Supplied questionDifficulty option (${val}) is not a questionDifficulty resolvable`,
      "INVALID_OPTION"
    );
  }
}

function validateQuestionType(val: unknown) {
  if (val === null) return;

  if (!val) {
    throw new DiscordTriviaError(
      `A questionType option for TriviaGameOptions is required`,
      "MISSING_OPTION"
    );
  } else if (typeof val != "string") {
    throw new DiscordTriviaError(
      `The questionType option for TriviaGameOptions must be a string`,
      "INVALID_OPTION"
    );
  } else if (!["multiple", "boolean"].includes(val.toLowerCase())) {
    throw new DiscordTriviaError(
      `Supplied questionType option (${val}) is not a questionType resolvable`,
      "INVALID_OPTION"
    );
  }
}

function validateQueueTime(val: unknown) {
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
}

function validateGuild(obj: unknown) {}

export default function (obj: TriviaGameOptions): void {
  try {
    validatePlayerCount("minPlayerCount", obj.minPlayerCount);
    validatePlayerCount("maxPlayerCount", obj.maxPlayerCount);

    checkPlayerCountRelation(
      obj.minPlayerCount as number,
      obj.maxPlayerCount as number
    );

    validateTimePerQuestion(obj.timePerQuestion);
    validateQuestionDifficulty(obj.questionDifficulty);
    validateQuestionAmount(obj.questionAmount);
    validateQuestionType(obj.questionType);
    validateQueueTime(obj.queueTime);
  } catch (err) {
    throw err;
  }
}
