import { Collection } from "discord.js";

import type { Snowflake, TextBasedChannel } from "discord.js";
import Game from "./Game";

/**
 * Represents the manager for trivia games.
 */
export default class GameManager {
  /**
   * This manager's ongoing games.
   */
  public readonly games: Collection<Snowflake, any> = new Collection();

  constructor() {}

  /**
   * Creates a new `Game` instance.
   * @param {TextBasedChannel} channel The channel this game is to be hosted in.
   * @returns {Game}
   */
  createGame(channel: TextBasedChannel) {
    return new Game(this, channel);
  }
}
