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

import * as x from 'discord-api-types/v9';

interface opt {
  content: string;
  ephemeral: boolean
}

export default class RootComponent {
  entity: Message | CommandInteraction;
  type: "message" | "interaction";
  channel: TextBasedChannel;
  guild: Guild;
  hostMember: GuildMember;
  reply = {
    message: (options: opt) => {
      return this.entity.reply(options);
    },
    interaction: (options: opt) => {
      return this.entity.reply(options);
    },
  };

  // The following error occures without ':any'
  // The inferred type of 'followUp' cannot be named without a reference to 'discord.js/node_modules/discord-api-types/v9'. This is likely not portable. A type annotation is necessary.
  followUp:any = {
    message: (options: opt) => {
      return this.entity.reply(options);
    },
    interaction: (
      options: opt
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
