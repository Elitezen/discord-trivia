import { Collection } from 'discord.js';

import { DecorationOptions } from "../Typings/interfaces";
import type { ColorResolvable, Snowflake } from 'discord.js';
import { DiscordComponentResolvable } from '../Typings/types';
import RootComponent from './RootComponent';
import Validator from './Validator';
import TriviaGame from './TriviaGame';

export default class TriviaManager implements DecorationOptions {
  public embedColor;
  public embedImage;
  public embedThumbnail;
  public readonly games = new Collection<Snowflake, TriviaGame>();
  protected defaults:DecorationOptions = {
    embedColor: 'Random',
    embedImage: 'https://github.com/Elitezen/discord-trivia/blob/main/Images/banner.png',
    embedThumbnail: 'https://github.com/Elitezen/discord-trivia/blob/main/Images/banner.png'
  };

  constructor(options?:Partial<DecorationOptions>) {
    this.embedColor = options?.embedColor 
      ?? this.defaults.embedColor;
    this.embedImage = options?.embedImage 
      || this.defaults.embedImage;
    this.embedThumbnail = options?.embedThumbnail 
      || this.defaults.embedThumbnail;
  }

  createGame(component:DiscordComponentResolvable) {
    try {
      const root = new RootComponent(component);
      new Validator(root).validateAll();

      return new TriviaGame(root, this);
    } catch(err) {
      throw err;
    }
  }
}