import {
  CommandInteraction,
  Guild,
  GuildMember,
  InteractionReplyOptions,
  Message,
  MessagePayload,
  ReplyMessageOptions,
  TextBasedChannel,
} from "discord.js";

export default class RootComponent {
  entity: Message | CommandInteraction;
  type: "message" | "interaction";
  channel: TextBasedChannel;
  guild: Guild;
  hostMember: GuildMember;
  reply = {
    message: (options: string | MessagePayload | ReplyMessageOptions) => {
      return this.entity.reply(options);
    },
    interaction: (options: InteractionReplyOptions) => {
      return this.entity.reply(options);
    },
  };

  followUp = {
    message: (options: string | MessagePayload | ReplyMessageOptions) => {
      return this.entity.reply(options);
    },
    interaction: (
      options: string | MessagePayload | InteractionReplyOptions
    ) => {
      return (this.entity as CommandInteraction).followUp(options);
    },
  };

  constructor(root: Message | CommandInteraction) {
    this.entity = root;
    if ((root as Message).content) {
      this.type = "message";
    } else if ((root as CommandInteraction).applicationId) {
      this.type = "interaction";
    } else {
      throw new TypeError(
        `root argument must be of type Message or CommandInteraction`
      );
    }

    this.channel = root.channel as TextBasedChannel;
    this.guild = root.guild as Guild;
    this.hostMember = root.member as GuildMember;
  }
}
