import { User } from "discord.js";
import Game from "./Game";

/**
 * Represents a trivia game player.
 * @implements {Player}
 */
export default class Player {
  /**
   * The game this player belongs to.
   * @type {Game}
   * @readonly
   */
  public readonly game: Game;

  /**
   * This player's user object.
   * @type {User}
   * @readonly
   */
  public readonly user: User;

  /**
   * The player's current correct answer streak
   * @type {number}
   */
  public correctAnswerStreak: number = 0;

  /**
   * This player's current point count.
   * @type {number}
   */
  public points: number = 0;

  /**
   * Whether this player has answered a question.
   * @type {boolean}
   */
  public hasAnswered: boolean = false;

  /**
   * Whether this player's answer is correct
   * @type {boolean}
   */
  public isCorrect: boolean = false;

  constructor(game: Game, user: User) {
    this.game = game;
    this.user = user;

    return this;
  }

  /**
   * Adds to this player's points.
   * @param {number} points
   */
  addPoints(points: number) {
    this.points += points;
  }

  /**
   * Sets `.isCorrect` for this player.
   * @param {boolean} bool
   */
  setIsCorrect(bool: boolean) {
    this.isCorrect = bool;
  }

  /**
   * Resets all round-related data of this player.
   */
  prepareForRound() {
    if (!this.hasAnswered) {
      this.correctAnswerStreak = 0;
    }

    this.hasAnswered = false;
    this.isCorrect = false;
  }
}