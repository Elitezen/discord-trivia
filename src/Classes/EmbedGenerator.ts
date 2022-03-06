import { ColorResolvable, MessageEmbed } from "discord.js";
import { TriviaQuestion } from "easy-trivia";
import constants from "../../constants";
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
        `${this.game.hostMember.displayName} is starting a Trivia Game!`
      )
      .setColor(this.theme)
      .setAuthor(constants.embeds.author)
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
      .setFooter(constants.embeds.interactWithButtons);
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
        .map((member) => `${member.displayName}`)
        .join("\n");
    }

    return new MessageEmbed()
      .setTitle("Trivia Game is now starting!")
      .setColor(this.theme)
      .setDescription(
        `**Players:**\n${playersList}${
          remainingPlayers
            ? `\n...\nAnd ${remainingPlayers.toString()} more!`
            : ""
        }`
      )
      .setAuthor(constants.embeds.author)
      .setFooter(constants.embeds.interactWithButtons);
  }

  leaderboardUpdate() {
    return new MessageEmbed()
      .setAuthor(constants.embeds.author)
      .setTitle("Leaderboard")
      .setColor(this.theme)
      .addFields(
        this.game.players
          .sort((e) => e.leaderboardPosition.current)
          .map((e) => {
            return {
              name: "#" + (e.leaderboardPosition.current + 1).toString(),
              value: `${e.toString()} ${e.points}`,
            };
          })
      );
  }

  finalLeaderboard() {
    const { emojis } = constants.embeds;
    const medals = [
      emojis('GOLD'),
      emojis('SILVER'),
      emojis('BRONZE')
    ];

    const podium = this.game.players
      .sort((e) => e.leaderboardPosition.current)
      .first(3)
      .map((m, i) => `${medals[i]} ${m.toString()} ${m.points}`)
      .join("\n");
    return new MessageEmbed()
      .setAuthor(constants.embeds.author)
      .setTitle("Game Has Ended")
      .setColor(this.theme)
      .setDescription(podium)
      .setFooter({
        text: "Thanks for playing",
      });
  }

  question(question: TriviaQuestion) {
    const embed = new MessageEmbed()
      .setAuthor(constants.embeds.author)
      .setTitle("New Question")
      .addFields(
        {
          name: "Category",
          value: question.category,
          inline: true,
        },
        {
          name: "Difficulty",
          value: question.difficulty,
          inline: true,
        },
        {
          name: "Question",
          value: question.value,
        }
      )
      .setColor(this.theme)
      .setFooter(constants.embeds.interactWithButtons);
    if (question.type == 'multiple') {
      const choices = question.allAnswers
        .map((ans, i) => {
          const symbol = constants.embeds.emojis(['A', 'B', 'C', 'D'][i]);
          return `${symbol} ${ans}`;
        }).join('\n');

      embed.addField('Choices', choices);
    }

    return embed;
  }
}
