import {
  InteractionType,
  TextChannel,
  Guild,
  CommandInteraction,
  InteractionReplyOptions,
  BaseMessageOptions,
  Message,
  GuildMember,
  ChannelType,
} from "discord.js";
import {
  DiscordComponentResolvable,
  DiscordComponentResolvableEnum,
} from "../Typings/types";

/**
 * Represents a Discord component that can be used to instantiate a trivia game.
 */
export default class RootComponent {
  /**
   * The type of data this component is.
   * @type {DiscordComponentResolvableEnum}
   * @readonly
   */
  public readonly type: DiscordComponentResolvableEnum;

  /**
   * The channel used for the trivia game.
   * @type {TextChannel}
   * @readonly
   */
  public readonly channel: TextChannel;

  /** The guild used for the trivia game.
   * @type {Guild}
   * @readonly
   */
  public readonly guild: Guild;

  /**
   * The raw component this component uses.
   * @type {DiscordComponentResolvable}
   * @readonly
   */
  public readonly component: DiscordComponentResolvable;

  /**
   * The member who instantiated the root component.
   * @type {GuildMember}
   * @readonly
   */
  public readonly member: GuildMember;

  /**
   * Used to reply to an interaction or message.
   * @param {InteractionReplyOptions | BaseMessageOptions} args
   */
  public reply: (
    args: InteractionReplyOptions | BaseMessageOptions
  ) => Promise<Message<boolean>>;

  /**
   * Used to reply to an interaction.
   * @param {InteractionReplyOptions} args
   * @returns {Promise<Message<boolean>>}
   * @private
   */
  #applicationCommandReply(
    args: InteractionReplyOptions
  ): Promise<Message<boolean>> {
    return (this.component as CommandInteraction).reply({
      ...args,
      fetchReply: true,
    });
  }

  /**
   * Used to reply to a message.
   * @param {BaseMessageOptions} args
   * @returns {Promise<Message<boolean>>}
   * @private
   */
  #messageReply(args: BaseMessageOptions): Promise<Message<boolean>> {
    return (this.component as Message).reply(args);
  }

  /**
   * @param {DiscordComponentResolvable} root The root component data.
   */
  constructor(root: DiscordComponentResolvable) {
    if (![2, 3].includes(root.type)) {
      throw "Invalid Root!";
    }

    if (root.channel === null) throw TypeError("The provided channel is null");
    if (root.channel.type !== ChannelType.GuildText)
      throw "The provided channel is not of type GuildText";
    if (root.guild === null) throw TypeError("The provided guild is null");

    this.type = root.type === InteractionType.ApplicationCommand ? 2 : 3;
    this.member = root.member as GuildMember;
    this.channel = root.channel;
    this.guild = root.guild;
    this.component = root;
    this.reply =
      root.type === InteractionType.ApplicationCommand
        ? this.#applicationCommandReply
        : this.#messageReply;
  }
}
