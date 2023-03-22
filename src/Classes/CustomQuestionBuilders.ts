import {
  BooleanString,
  Category,
  CategoryNames,
  IncorrectAnswers,
  QuestionDifficultyType,
  QuestionTypes,
} from "open-trivia-db";
import { GameQuestion } from "../Typings/interfaces";

/**
 * The base for custom question builders.
 */
export class BaseCustomQuestionBuilder {
  /**
   * This question's data.
   * @type {Partial<GameQuestion>}
   */
  public data: Partial<GameQuestion>;

  constructor() {
    this.data = {};
  }

  /**
   * Sets this question's value.
   * @param {string} value
   * @returns {this}
   */
  setValue(value: string): this {
    this.data.value = value;
    return this;
  }

  /**
   * Sets this question's category.
   * @param {string} category
   * @returns {this}
   */
  setCategory(category: string | CategoryNames): this {
    if (isNaN(+category)) {
      this.data.category = category as string;
    } else {
      this.data.category = Category.nameById(+category) || "Custom";
    }

    return this;
  }

  /**
   * Sets this question's difficulty.
   * @param {QuestionDifficultyType} difficulty
   * @returns {this}
   */
  setDifficulty(difficulty: QuestionDifficultyType): this {
    this.data.difficulty = difficulty;
    return this;
  }
}

/**
 * Builder for a true/false custom question
 */
export class BooleanQuestion extends BaseCustomQuestionBuilder {
  constructor() {
    super();
    this.data.type = QuestionTypes.Boolean;
  }

  /**
   * Sets the correct answer for this question.
   * @param {BooleanString} answer 'true' or 'false'
   * @returns {this}
   */
  setCorrectAnswer(answer: BooleanString): this {
    this.data.correctAnswer = answer;
    this.data.incorrectAnswers = answer === "true" ? "false" : "true";
    return this;
  }
}

/**
 * Builder for a multiple choice custom question
 */
export class MultipleChoiceQuestion extends BaseCustomQuestionBuilder {
  constructor() {
    super();
    this.data.type = QuestionTypes.Multiple;
  }

  /**
   * Sets this question's correct answer.
   * @param {string} answer
   * @returns {this}
   */
  setCorrectAnswer(answer: string): this {
    this.data.correctAnswer = answer;
    return this;
  }

  /**
   * Sets this question's incorrect answers.
   * @param {IncorrectAnswers} incAnswers
   * @returns {this}
   */
  setIncorrectAnswers(incAnswers: IncorrectAnswers): this {
    this.data.incorrectAnswers = incAnswers;
    return this;
  }
}

/**
 * Provides easier readable and memerable extractions for the builders.
 */
export const CustomQuestionBuilder = {
  Boolean: BooleanQuestion,
  Multiple: MultipleChoiceQuestion,
};
