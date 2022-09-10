import { InteractionType, TextBasedChannel, Guild, CommandInteraction, InteractionReplyOptions, ReplyMessageOptions, Message, GuildMember, MessageType } from 'discord.js';

import { DiscordComponentResolvable, DiscordComponentResolvableEnum, CommandInteractionReply, MessageReply } from "../Typings/types";


export default class RootComponent {
  public readonly type: DiscordComponentResolvableEnum;
  public readonly channel: TextBasedChannel | null;
  public readonly guild: Guild | null;
  public readonly component: DiscordComponentResolvable;
  public readonly member: GuildMember;

  reply = {
    [InteractionType.ApplicationCommand]: (args:InteractionReplyOptions)
    :ReturnType<CommandInteractionReply> => {
      return (this.component as CommandInteraction).reply(args);
    },

    [InteractionType.MessageComponent]: (args: ReplyMessageOptions)
    :ReturnType<MessageReply> => {
      return (this.component as Message).reply(args);
    }
  }

  constructor(root:DiscordComponentResolvable) {
    if (![2, 3].includes(root.type)) {
      throw 'Invalid Root!';
    } 

    this.type = root.type === InteractionType.ApplicationCommand ? 2 : 3;
    this.member = root.member as GuildMember;
    this.channel = root.channel;
    this.guild = root.guild;
    this.component = root;
  }
}