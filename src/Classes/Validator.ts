import RootComponent from "./RootComponent";
import { ChannelType } from "discord.js";
import DiscordTriviaError from "./DiscordTriviaError";

/**
 * Used to validating Discord components before using them for trivia games.
 */
export default class Validator {
  /**
   * The component this validator will check.
   * @type {RootComponent}
   */
  public readonly root: RootComponent;

  constructor(root: RootComponent) {
    this.root = root;
  }

  /**
   * Validates the guild, channel, and host member.
   */
  validateAll() {
    this.validateGuild();
    this.validateChannel();
    this.validateMember();
  }

  /**
   * Validates the guild
   */
  validateGuild() {
    if (this.root.guild === null)
      throw new DiscordTriviaError("The provided guild is null");
    return true;
  }

  /**
   * Validates the channel
   */
  validateChannel() {
    if (this.root.channel === null) {
      throw new DiscordTriviaError("The provided channel is null");
    } else if (this.root.channel.type !== ChannelType.GuildText) {
      throw new DiscordTriviaError(
        "The provided channel is not of type GuildText"
      );
    }

    return true;
  }

  /**
   * Validates the host member.
   */
  validateMember() {
    if (this.root.member === null)
      throw new DiscordTriviaError("The provided host member is null");
    return true;
  }
}
