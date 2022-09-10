import { ColorResolvable, GuildMember } from "discord.js";
import TriviaGame from "../Classes/TriviaGame";

export interface DecorationOptions {
  embedColor: ColorResolvable;
  embedImage: string;
  embedThumbnail: string;
}

export interface Player {
  points: number;
  hasAnswered: boolean;
  isCorrect: boolean;
  game: TriviaGame;
  member: GuildMember;
}