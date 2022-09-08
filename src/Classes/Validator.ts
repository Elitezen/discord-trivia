import RootComponent from "./RootComponent";

import { ChannelType } from 'discord.js';

export default class Validator {
  public readonly root: RootComponent;
  constructor(root:RootComponent) {
    this.root = root;
  }

  validateAll() {
    this.validateGuild();
    this.validateChannel();
    this.validateMember();
  }

  validateGuild() {
    if (this.root.guild === null) throw 'Null Guild!';
    return true;
  }

  validateChannel() {
    if (this.root.channel === null) {
      throw 'Null Channel!';
    } else if (this.root.channel.type !== ChannelType.GuildText) {
      throw 'Non-Text Channel!';
    }

    return true;
  }

  validateMember() {
    if (this.root.member === null) throw 'Null Member!';
    return true;
  }
}