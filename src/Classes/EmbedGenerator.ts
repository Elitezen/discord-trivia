import { ColorResolvable, MessageEmbed } from "discord.js";
import { TriviaQuestion } from "easy-trivia";
import embedConstants from "../../embedConstants";
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
      .setAuthor(embedConstants.Author)
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
      //.setImage("https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Example_image.svg/600px-Example_image.svg.png")
      .setFooter(embedConstants.InteractWithButtons);
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
        .map((member) => `• ${member.displayName}`)
        .join("\n");
    }

    return new MessageEmbed()
      .setTitle("Trivia Game is now starting!")
      .setColor(this.theme)
      .setDescription(
        `**Players:**\n${playersList}${remainingPlayers
          ? `\n...\nAnd ${remainingPlayers.toString()} more!`
          : ""
        }`
      )
      .setAuthor(embedConstants.Author);
  }

  leaderboardUpdate(game: TriviaGame) {
    return new MessageEmbed()
      .setAuthor(embedConstants.Author)
      .setTitle('Leaderboard')
      .setColor(this.theme)
      .addFields(
        game.players.sort(e => e.leaderboardPosition.current)
          .map(e => ({
            name: '#' + (e.leaderboardPosition.current + 1).toString() + ` ${e.displayName}`,
            value: e.points.toString() + ` ${e.points <= 1 ? "point" : "points"}`
          }))
      );
  }

  question(question: TriviaQuestion) {
    return new MessageEmbed()
      .setAuthor(embedConstants.Author)
      .setTitle('New Question')
      .addFields(
        {
          name: 'Category',
          value: question.category,
          inline: true
        },
        {
          name: 'Difficulty',
          value: question.difficulty,
          inline: true
        },
        {
          name: 'Question',
          value: question.value,
        },
        {
          name: 'Choices',
          value: question.allAnswers
            .map((q, i) => {
              const choices = question.type == 'multiple' ? ['A', 'B', 'C', 'D'] : ['True', 'False'];
              const choice = choices[i];
              //@ts-expect-error //TS will think that it could still be a boolean question.
              return (question.type == "multiple" ? `${embedConstants.Emojis[choice]} ` : "") + (question.type == "boolean" ? choices[i] : "") + (question.type == "boolean" ? "" : q);
            })
            .join('\n')
        }
      )
      .setColor(this.theme)
      .setFooter(embedConstants.InteractWithButtons)
  }
}
