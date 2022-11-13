import { ColorResolvable, EmbedBuilder } from "discord.js";
import { Category, Question, CategoryResolvable } from "open-trivia-db";
import constants from "../../constants";
import { QuestionData, TriviaPlayer } from "../Typings/interfaces";
import TriviaGame from "./TriviaGame";

export default class EmbedGenerator {
  private readonly game: TriviaGame;
  private readonly theme: ColorResolvable;

  constructor(game: TriviaGame) {
    this.game = game;
    this.theme = game.manager.options.theme || "Blurple";
  }

  gameQueueStart() {
    return new EmbedBuilder()
      .setTitle("Disord Trivia")
      .setDescription(
        `${this.game.hostMember.displayName} is starting a Trivia Game!`
      )
      .setColor(this.theme)
      .setAuthor(constants.embeds.author)
      .setThumbnail(
        "https://cdn.discordapp.com/attachments/947636249856999424/947636392673038336/icon.png"
      )
      .addFields(
        {
          name: "Category",
          value:
            Category.resolve(
              (this.game.options.questionData as QuestionData)
                .category as CategoryResolvable
            )?.prettyName || "Randomized",
          inline: true,
        },
        {
          name: "Difficulty",
          value:
            (this.game.options.questionData as QuestionData).difficulty ||
            "Mixed",
          inline: true,
        },
        {
          name: "Max Players",
          value: this.game.options.maximumPlayerCount.toString() || "NULL",
          inline: true,
        }
      )
      .setImage(this.game.manager.options.image!)
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
        .map((member) => `• ${member.displayName}`)
        .join("\n");
    }

    return new EmbedBuilder()
      .setTitle("Trivia Game is now starting!")
      .setThumbnail(
        "https://cdn.discordapp.com/attachments/947636249856999424/947636392673038336/icon.png"
      )
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

  leaderboardUpdate(question: Question) {
    const embed = new EmbedBuilder()
      .setAuthor(constants.embeds.author)
      .setTitle("Leaderboard")
      .setThumbnail(
        "https://cdn.discordapp.com/attachments/947636249856999424/947636392673038336/icon.png"
      )
      .setColor(this.theme)
      .addFields(
        Array.from(this.game.leaderboard).map((entry, i) => {
          const player = entry[1] as TriviaPlayer;
          const streakBonus = Math.min(
            Math.max(
              (player.correctAnswerStreak -
                (this.game.options.streakDefinitionLevel - 1)) *
                this.game.options.pointsPerStreakAmount,
              0
            ),
            this.game.options.maximumStreakBonus
          );

          return {
            name: `#${i + 1}`,
            value: `${player.isCorrect ? "✅" : "❌"} ${player.toString()}  ${
              player.points
            } ${
              player.correctAnswerStreak >=
              this.game.options.streakDefinitionLevel
                ? ` (🔥 +${streakBonus})`
                : ""
            }`,
          };
        })
      );

    let description = "**Round Over**!\n";

    if (this.game.manager.options.showAnswers) {
      description += `Correct Answer:\n**${question.correctAnswer}**\n`;
    }

    const playersWithStreaks = this.game.players.filter(
      (p) => p.correctAnswerStreak >= 3
    );
    if (playersWithStreaks.size) {
      const list = playersWithStreaks.map((p) => p.toString()).join(", ");
      description += `\n🔥 ${list} are on a streak!`;
    }

    if (this.game.players.every((p) => p.isCorrect)) {
      embed.setFooter({
        text: "Everyone got it right!",
      });
    } else if (this.game.players.every((p) => !p.isCorrect)) {
      embed.setFooter({
        text: "Nobody got it right.",
      });
    }

    embed.setDescription(description);

    return embed;
  }

  finalLeaderboard() {
    const { emojis } = constants.embeds;
    const medals = [emojis("GOLD"), emojis("SILVER"), emojis("BRONZE")];

    const podium = this.game.leaderboard
      .first(3)
      .map((m, i) => `${medals[i]} ${m.toString()} ${m.points}`)
      .join("\n");
    return new EmbedBuilder()
      .setAuthor(constants.embeds.author)
      .setTitle("Game Has Ended")
      .setThumbnail(
        "https://cdn.discordapp.com/attachments/947636249856999424/947636392673038336/icon.png"
      )
      .setColor(this.theme)
      .setDescription(podium.length ? podium : null)
      .setFooter({
        text: "Thanks for playing",
      });
  }

  question(question: Question) {
    const embed = new EmbedBuilder()
      .setAuthor(constants.embeds.author)
      .setTitle("New Question")
      .setThumbnail(
        "https://cdn.discordapp.com/attachments/947636249856999424/947636392673038336/icon.png"
      )
      .addFields(
        {
          name: "Category",
          value: question.category || "Custom",
          inline: true,
        },
        {
          name: "Difficulty",
          value: question.difficulty || "Custom",
          inline: true,
        },
        {
          name: "Question",
          value: question.value,
        }
      )
      .setColor(this.theme)
      .setFooter(constants.embeds.interactWithButtons);
    if (question.type == "multiple") {
      const choices = question.allAnswers
        .map((ans, i) => {
          const symbol = constants.embeds.emojis(["A", "B", "C", "D"][i]);
          return `${symbol} ${ans}`;
        })
        .join("\n");

      embed.addFields([{ name: "Choices", value: choices }]);
    }

    return embed;
  }
}
