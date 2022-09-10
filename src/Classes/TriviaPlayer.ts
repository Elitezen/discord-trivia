import { GuildMember } from "discord.js";
import { Player } from "../Typings/interfaces";
import TriviaGame from "./TriviaGame";

export default class TriviaPlayer implements Player {
  public readonly game: TriviaGame;
  public readonly member: GuildMember;
  public points = 0;
  public hasAnswered = false;
  public isCorrect = false;

  constructor(game:TriviaGame, member:GuildMember) {
    this.game = game;
    this.member = member;

    return this;
  }

  addPoints(points:number) {
    this.points += points;
  }

  prepareForRound() {
    this.hasAnswered = false;
    this.isCorrect = false;
  }
}