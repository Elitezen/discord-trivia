import { BooleanString, Category, CategoryNames, IncorrectAnswers, QuestionDifficulties, QuestionDifficultyType, QuestionTypeType } from "open-trivia-db";
import { CustomQuestion } from "../Typings/types";

/**
 * The base for custom question builders.
 */
export class BaseCustomQuestionBuilder {
  /**
   * This question's data.
   * @type {Partial<CustomQuestion<'multiple' | 'boolean'>>}
   */
  public data: Partial<CustomQuestion<'multiple' | 'boolean'>>;

  constructor() {
    this.data = {};
  }

  /**
   * Sets this question's value.
   * @param {string} value 
   * @returns {this}
   */
  setValue(value:string):this {
    this.data.value = value;
    return this;
  }

  /**
   * Sets this question's category.
   * @param {number | string} category 
   * @returns {this}
   */
  setCategory(category: number | string):this {
    if (isNaN(+category)) {
      this.data.category = category;
    } else {
      this.data.category = Category.nameById(+category) || "Custom"
    }

    return this;
  }

  /**
   * Sets this question's difficulty.
   * @param {QuestionDifficultyType} difficulty 
   * @returns {this}
   */
  setDifficulty(difficulty: QuestionDifficultyType):this {
    this.data.difficulty = difficulty;
    return this;
  }
}

/**
 * Builder for a true/false custom question
 */
export class CustomQuestionBuilderBoolean extends BaseCustomQuestionBuilder {
  constructor() {
    super();
    this.data.type = 'boolean';
  }

  setCorrectAnswer(answer: BooleanString):this {
    this.data.correctAnswer = answer;
    this.data.incorrectAnswers = answer === 'true' ? 'false' : 'true';
    return this;
  }
}

/**
 * Builder for a multiple choice custom question
 */
export class CustomQuestionBuilderMultipleChoice extends BaseCustomQuestionBuilder {
  constructor() {
    super();
    this.data.type = 'multiple';
  }

  /**
   * Sets this question's correct answer.
   * @param {string} answer
   * @returns {this}
   */
  setCorrectAnswer(answer: string):this {
    this.data.correctAnswer = answer;
    return this;
  }

  /**
   * Sets this question's incorrect answers.
   * @param {IncorrectAnswers} incAnswers
   * @returns {this}
   */
  setIncorrectAnswers(incAnswers: IncorrectAnswers):this {
    this.data.incorrectAnswers = incAnswers;
    return this;
  }
}

/**
 * Static class for providing custom question builders
 */
export class CustomQuestionBuilder {
  static Multiple = CustomQuestionBuilderMultipleChoice;
  static Boolean = CustomQuestionBuilderBoolean;
}