import { ButtonStyle, Collection } from "discord.js";

import { DecorationOptions } from "../Typings/interfaces";
import type { Snowflake } from "discord.js";
import { DiscordComponentResolvable } from "../Typings/types";
import RootComponent from "./RootComponent";
import Validator from "./Validator";
import TriviaGame from "./TriviaGame";

/**
 * Represents a trivia manager.
 */
export default class TriviaManager {
  /**
   * The games this manager maintains.
   * @type {Collection<Snowflake, TriviaGame>}
   */
  public readonly games: Collection<Snowflake, TriviaGame> = new Collection<
    Snowflake,
    TriviaGame
  >();

  /**
   * The default decoration options for this manager's games.
   * @type {DecorationOptions}
   */
  protected defaultDecorationOptions: DecorationOptions = {
    embedColor: [0, 0, 255],
    embedImage:
      "https://raw.githubusercontent.com/Elitezen/discord-trivia/main/Images/banner.png",
    embedThumbnail:
      "https://raw.githubusercontent.com/Elitezen/discord-trivia/main/Images/banner.png",
    buttonStyle: ButtonStyle.Primary,
  };

  /**
   * The current decoration options for this manager.
   * @type {DecorationOptions}
   */
  public decoration: DecorationOptions = this.defaultDecorationOptions;

  constructor(options: Partial<DecorationOptions> = {}) {
    this.decoration = Object.assign(this.defaultDecorationOptions, options);
  }

  /**
   * Creates a new trivia game and returns it.
   * @param {DiscordComponentResolvable} component The Discord component this game will use.
   * @returns {TriviaGame}
   */
  createGame(component: DiscordComponentResolvable): TriviaGame {
    try {
      const root = new RootComponent(component);
      new Validator(root).validateAll();

      return new TriviaGame(root, this);
    } catch (err) {
      throw err;
    }
  }
}
