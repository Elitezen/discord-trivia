import { GuildMember } from "discord.js";
import RootComponent from "./RootComponent";

export default class TriviaGame {
  public readonly host: GuildMember;
  constructor(root:RootComponent) {
    this.host = root.member;
  }


}