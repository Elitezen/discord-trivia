import { EmbedBuilder } from "discord.js";
import { Category, CategoryNameType, QuestionTypes } from "open-trivia-db";
import { GameQuestion } from "../Typings/interfaces";
import TriviaGame from "./TriviaGame";
import TriviaPlayer from "./TriviaPlayer";

/**
 * Creates pre-defined embeds.
 */
export default class EmbedGenerator {
  /**
   * The game this embed generator is tied to.
   * @type {TriviaGame}
   * @readonly
   * @private
   */
  private readonly game: TriviaGame;

  /**
   * The game this generator will be tied to.
   * @param {TriviaGame} game
   */
  constructor(game: TriviaGame) {
    this.game = game;
  }

  /**
   * Applies redundant embed styles to a given embed and returns a new embed.
   * @param {EmbedBuilder} embed The embed to style.
   * @returns {EmbedBuilder}
   */
  private applyDecoration(embed: EmbedBuilder): EmbedBuilder {
    const { embedColor, embedThumbnail } = this.game.decoration;
    return embed.setColor(embedColor).setThumbnail(embedThumbnail);
  }

  /**
   * The embed displayed on game queue start.
   * @returns {EmbedBuilder}
   */
  gameQueue(): EmbedBuilder {
    const { amount, category, difficulty } = this.game.gameQuestionOptions;
    const categoryName:CategoryNameType | 'Randomized' = !!category ? 
      isNaN(+category) ? category as CategoryNameType : Category.nameById(+category)!
      : 'Randomized';

    const embed = new EmbedBuilder()
      .setTitle(`${this.game.host.displayName} is starting a trivia game!`)
      .addFields(
        { name: 'Question Amount', value: amount.toString(), inline: true  },
        { name: 'Category', value: categoryName, inline: true },
        { name: 'Difficulty', value:difficulty || 'Randomized', inline: true }
      )
      .setDescription("Click the **Join** button to enter!")
      .setImage(this.game.decoration.embedImage);
    return this.applyDecoration(embed);
  }

  /**
   * The embed displayed on game start.
   * @returns {EmbedBuilder}
   */
  gameStart(): EmbedBuilder {
    let category =
      Category.nameById(
        this.game.gameQuestionOptions.category
          ? +this.game.gameQuestionOptions.category
          : 0
      ) ||
      this.game.gameQuestionOptions.category?.toString() ||
      "Randomized";
    const embed = new EmbedBuilder()
      .setDescription("The game is now starting!")
      .addFields({
        name: "Question Amount",
        value: this.game.gameQuestionOptions.amount.toString(),
      });
    embed.addFields({ name: "Category", value: category });
    return this.applyDecoration(embed);
  }

  /**
   * The embed displayed for a game question.
   * @param {GameQuestion} question The question for this embed.
   * @returns {EmbedBuilder}
   */
  question(question: GameQuestion): EmbedBuilder {
    console.log(question)
    const embed = new EmbedBuilder()
      .addFields(
        { name: "Category", value: question.category },
        { name: "Question", value: question.value }
      )
      .setFooter({
        text: `You have ${
          this.game.gameOptions.timePerQuestion / 1_000
        } seconds to answer`,
      });
    if (question.type === QuestionTypes.Multiple)
      embed.addFields({
        name: "Choices",
        value: question.allAnswers
          .map((ans, i) => `${["🇦", "🇧", "🇨", "🇩"][i]} **${ans}**`)
          .join("\n"),
      });
    return this.applyDecoration(embed);
  }

  /**
   * The embed displayed at the end of each round
   * @param {GameQuestion} question The question of the round.
   * @returns {EmbedBuilder}
   */
  leaderboardUpdate(question: GameQuestion): EmbedBuilder {
    const embed = new EmbedBuilder().setTitle("Leaderboard").addFields(
      Array.from(this.game.leaderboard).map((entry, i) => {
        const player = entry[1] as TriviaPlayer;

        const streakBonus = Math.min(
          Math.max(
            (player.correctAnswerStreak -
              (this.game.gameOptions.streakDefinitionLevel - 1)) *
              this.game.gameOptions.pointsPerSteakAmount,
            0
          ),
          this.game.gameOptions.maximumStreakBonus
        );

        return {
          name: `#${i + 1}`,
          value: `${
            player.isCorrect ? "✅" : "❌"
          } ${player.member.toString()}  ${player.points} ${
            player.correctAnswerStreak >=
            this.game.gameOptions.streakDefinitionLevel
              ? ` (🔥 +${streakBonus})`
              : ""
          }`,
        };
      })
    );

    let description = "**Round Over**!\n";

    if (this.game.gameOptions.showAnswers) {
      description += `Correct Answer:\n**${question.correctAnswer}**\n`;
    }

    const playersWithStreaks = this.game.players.filter(
      (p) => p.correctAnswerStreak >= 3
    );
    if (playersWithStreaks.size) {
      const list = playersWithStreaks
        .map((p) => p.member.toString())
        .join(", ");
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
    return this.applyDecoration(embed);
  }

  /**
   * The embed displayed at the end of the game.
   * @returns {EmbedBuilder}
   */
  finalLeaderboard(): EmbedBuilder {
    const embed = new EmbedBuilder().setTitle("Game Over!").addFields(
      Array.from(this.game.leaderboard)
        .slice(0, 3)
        .map((entry, i) => {
          const player = entry[1] as TriviaPlayer;

          return {
            name: `#${i + 1}`,
            value: `${["🏅", "🥈", "🥉"][i]} ${player.member.toString()} **${
              player.points
            }**`,
          };
        })
    );
    return this.applyDecoration(embed);
  }
}
