import { ColorResolvable, MessageEmbed } from "discord.js";
import TriviaGame from "../Classes/TriviaGame";

export default class EmbedGenerator {
  private readonly game: TriviaGame;
  private readonly theme: ColorResolvable;

  constructor(game: TriviaGame) {
    this.game = game;
    this.theme = game.manager.options.theme;
  }

  gameQueueStart() {
    return new MessageEmbed()
      .setTitle(
        `${this.game.hostMember.displayName} is Preparing a Trivia Game!`
      )
      .setColor(this.theme)
      .setAuthor({
        name: "Powered by disord-trivia",
        iconURL:
          "https://media.discordapp.net/attachments/933214093450555463/933550211517808721/trivia_2.png",
        url: "https://github.com/Elitezen/discord-trivia",
      })
      .addFields(
        {
          name: "Category",
          value: this.game.options.triviaCategory || "Randomized",
          inline: true,
        },
        {
          name: "Difficulty",
          value: this.game.options.questionDifficulty || "Mixed",
          inline: true,
        },
        {
          name: "Max Players",
          value: this.game.options.maxPlayerCount.toString(),
          inline: true,
        }
      )
      .setImage(
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Example_image.svg/600px-Example_image.svg.png"
      )
      .setFooter({
        text: "Use the buttons below to interact",
        iconURL:
          "https://cdn.discordapp.com/emojis/935296239858241577.png?size=96&quality=lossless",
      });
  }

  gameStart() {
    let playersList: string;
    let remainingPlayers: number | null = null;

    if (this.game.players.size > 10) {
      playersList = Array.from(this.game.players.first(10))
        .map((member) => `**${member.displayName}**`)
        .join("\n");

      remainingPlayers = this.game.players.size - 10;
    } else {
      playersList = Array.from(this.game.players.values())
        .map((member) => `**${member.displayName}**`)
        .join("\n");
    }

    return new MessageEmbed()
      .setTitle("The Trivia Game is now Starting!")
      .setColor(this.theme)
      .setDescription(
        `Players:\n${playersList} ${
          remainingPlayers
            ? `\n...\nAnd ${remainingPlayers.toString()} more!`
            : ""
        }`
      )
      .setFooter({
        text: "Use the buttons below to interact",
        iconURL:
          "https://cdn.discordapp.com/emojis/935296239858241577.png?size=96&quality=lossless",
      });
  }
}
