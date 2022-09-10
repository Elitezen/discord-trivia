import { Collection, GuildMember, Snowflake } from "discord.js";
import { Player } from "../Typings/interfaces";
import TriviaPlayer from "./TriviaPlayer";
import RootComponent from "./RootComponent";
import TriviaManager from "./TriviaManager";

export default class TriviaGame {
  public readonly host: GuildMember;
  public readonly manager: TriviaManager;
  public readonly players: Collection<Snowflake, Player>;
  protected playerFilter = {
    callback: (member:GuildMember) => true,
    text: 'You do not meet the criteria to join this game'
  };

  constructor(root:RootComponent, manager:TriviaManager) {
    this.host = root.member;
    this.manager = manager;
    this.players = new Collection();

    this.addPlayer(root.member);
  }

  protected addPlayer(member:GuildMember, component?: RootComponent) {
    if (!this.playerFilter.callback(member)) {
      return component?.reply[component.type]({
        content: this.playerFilter.text,
        ephemeral: true
      })
    }

    this.players.set(member.id, new TriviaPlayer(this, member));
  }

  public allowMember(options:{
    filter: (member:GuildMember) => boolean;
    text?: string;
  }) {
    this.playerFilter.callback = options.filter;
    if (typeof options.text === 'string') this.playerFilter.text = options.text;

    return this;
  }
}