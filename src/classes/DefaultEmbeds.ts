import { EmbedBuilder } from "discord.js";
import { Category, QuestionTypes } from "open-trivia-db";

import type Game from "./Game";
import type Player from "./Player";
import type { CategoryNameType } from "open-trivia-db";
import type { GameQuestion } from "../typings/interfaces";

/**
 * Creates pre-defined embeds.
 */
export default abstract class DefaultEmbeds {
    /**
     * The embed displayed whenever a user is rejected from the game.
     */
    static filterRejected(): EmbedBuilder {
        return new EmbedBuilder().setDescription(
            "You do not meet the criteria to join this game"
        );
    }

    /**
     * The embed displayed at the end of the game.
     * @returns {EmbedBuilder}
     */
    static finalLeaderboard(game: Game): EmbedBuilder {
        const embed = new EmbedBuilder().setTitle("Game Over!").addFields(
            Array.from(game.leaderboard)
                .slice(0, 3)
                .map((entry, i) => {
                    const player = entry[1] as Player;

                    return {
                        name: `#${i + 1}`,
                        value: `${
                            ["🏅", "🥈", "🥉"][i]
                        } ${player.user.toString()} **${player.points}**`
                    };
                })
        );
        return embed;
    }

    /**
     * The embed displayed at the end of a game.
     */
    static gameEnd(): EmbedBuilder {
        return new EmbedBuilder().setDescription("The game has finished");
    }

    /**
     * The embed displayed on game start.
     * @returns {EmbedBuilder}
     */
    static gameStart(game: Game): EmbedBuilder {
        let category =
            Category.nameById(
                game.config.fetchQuestionsOptions.category
                    ? +game.config.fetchQuestionsOptions.category
                    : 0
            ) ||
            game.config.fetchQuestionsOptions.category?.toString() ||
            "Randomized";
        const embed = new EmbedBuilder()
            .setDescription("The game is now starting!")
            .addFields({
                name: "Question Amount",
                value: game.questions.length.toString()
            });
        embed.addFields({ name: "Category", value: category });
        return embed;
    }

    /**
     * The embed displayed on game queue start.
     * @returns {EmbedBuilder}
     */
    static gameQueue(game: Game): EmbedBuilder {
        const { amount, category, difficulty } =
            game.config.fetchQuestionsOptions;
        const categoryName: CategoryNameType | "Randomized" = !!category
            ? isNaN(+category)
                ? (category as CategoryNameType)
                : Category.nameById(+category)!
            : "Randomized";

        const embed = new EmbedBuilder()
            .setTitle(`A Trivia Game Has Been Started`)
            .addFields({
                name: "Game Info: ",
                value: `- ${
                    amount + game.config.customQuestions.length
                } Question${amount > 1 ? "s" : ""}\n- ${
                    difficulty || "Randomized"
                } Difficulty\n- ${categoryName} Category`
            })
            .setFooter({
                text: "Click the button to enter"
            });
        if (game.players.size)
            embed.addFields({
                name: "Queue",
                value: game.players
                    .map((p) => `▶️ ${p.user.toString()}`)
                    .join("\n")
            });
        return embed;
    }

    /**
     * The embed displayed when not enough players join the game.
     */
    static gameQueueTimeout(): EmbedBuilder {
        return new EmbedBuilder().setDescription(
            "Not enough users joined the game. Game has been cancelled."
        );
    }

    /**
     * The embed displayed at the end of each round
     * @param {GameQuestion} question The question of the round.
     * @returns {EmbedBuilder}
     */
    static leaderboardUpdate(question: GameQuestion, game: Game): EmbedBuilder {
        const embed = new EmbedBuilder().setTitle("Leaderboard").addFields(
            Array.from(game.leaderboard).map((entry, i) => {
                const player = entry[1] as Player;

                const streakBonus = Math.min(
                    Math.max(
                        (player.correctAnswerStreak -
                            (game.config.streakDefinitionLevel - 1)) *
                            game.config.pointsPerStreakAmount,
                        0
                    ),
                    game.config.maximumStreakBonus
                );

                return {
                    name: `#${i + 1}`,
                    value: `${
                        player.isCorrect ? "✅" : "❌"
                    } ${player.user.toString()}  ${player.points} ${
                        player.correctAnswerStreak >=
                        game.config.streakDefinitionLevel
                            ? ` (🔥 +${streakBonus})`
                            : ""
                    }`
                };
            })
        );

        let description = "**Round Over**!\n";

        if (game.config.showAnswers) {
            description += `Correct Answer:\n**${question.correctAnswer}**\n`;
        }

        const playersWithStreaks = game.players.filter(
            (p) => p.correctAnswerStreak >= 3
        );
        if (playersWithStreaks.size) {
            const list = playersWithStreaks
                .map((p) => p.user.toString())
                .join(", ");
            description += `\n🔥 ${list} are on a streak!`;
        }

        if (game.players.every((p) => p.isCorrect)) {
            embed.setFooter({
                text: "Everyone got it right!"
            });
        } else if (game.players.every((p) => !p.isCorrect)) {
            embed.setFooter({
                text: "Nobody got it right."
            });
        }

        embed.setDescription(description);
        return embed;
    }

    /**
     * The embed displayed when a player tries to answer twice on the same question.
     */
    static playerAlreadyAnswered(): EmbedBuilder {
        return new EmbedBuilder().setDescription(
            "You have already chosen an answer."
        );
    }

    /**
     * The embed when a user tries to join the same match twice.
     */
    static playerAlreadyQueued(): EmbedBuilder {
        return new EmbedBuilder().setDescription(
            "You are not a part of this match"
        );
    }

    /**
     * The embed displayed whenever a user answers a question.
     * @param {Game} game
     * @param {Player} player
     * @param {number} timeElapsed The amount of time in milliseconds that have passed between the question's emission to the player's answer.
     */

    static playerAnsweredStats(
        game: Game,
        player: Player,
        timeElapsed: number
    ): EmbedBuilder {
        return new EmbedBuilder().setDescription(
            `Your answer has been locked in. Time: ${(
                timeElapsed / 1000
            ).toFixed(2)} seconds`
        );
    }

    /**
     * The embed displayed when a user joins a game
     * @param {Player} player
     * @param {Game} game
     */
    static playerJoin(player: Player, game: Game): EmbedBuilder {
        return new EmbedBuilder().setDescription(
            `You have joined the game, ${player.user.toString()}!`
        );
    }

    /**
     * The embed displayed when a user tries to play in a game they're not in.
     */
    static playerNotInMatch(): EmbedBuilder {
        return new EmbedBuilder().setDescription(
            "You are not a part of this match"
        );
    }

    /**
     * The embed displayed for a game question.
     * @param {GameQuestion} question The question for this embed.
     * @returns {EmbedBuilder}
     */
    static question(game: Game, question: GameQuestion): EmbedBuilder {
        const playersAnswered = game.players.filter((p) => p.hasAnswered);
        const embed = new EmbedBuilder()
            .addFields(
                { name: "Category", value: question.category },
                { name: "Question", value: question.value }
            )
            .setFooter({
                text: `You have ${
                    game.config.timePerQuestion / 1_000
                } seconds to answer`
            });
        if (question.type === QuestionTypes.Multiple)
            embed.addFields({
                name: "Choices",
                value: question.allAnswers
                    .map((ans, i) => `${["🇦", "🇧", "🇨", "🇩"][i]} **${ans}**`)
                    .join("\n")
            });
        if (playersAnswered.size)
            embed.setDescription(
                `\`${playersAnswered.size}/${game.players.size} answers locked in\``
            );
        return embed;
    }
}
