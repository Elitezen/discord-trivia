import { Collection, GuildMember } from 'discord.js';

import { TriviaGame, TriviaManagerOptions } from "../Typings/interfaces";
import type { ColorResolvable, Snowflake } from 'discord.js';
import { DiscordComponentResolvable } from '../Typings/types';
import RootComponent from './RootComponent';
import Validator from './Validator';

export default class TriviaManager {
  public embedColor: ColorResolvable;
  public embedImage: string | null;
  public readonly games = new Collection<Snowflake, TriviaGame>();

  constructor(options?:Partial<TriviaManagerOptions>) {
    this.embedColor = options?.embedColor ?? 'Random';
    this.embedImage = options?.embedImage || null;
  }

  createGame(component:DiscordComponentResolvable) {
    try {
      const root = new RootComponent(component);
      new Validator(root).validateAll();

      
    } catch(err) {
      throw err;
    }

    return this;
  }
}