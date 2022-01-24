import { MessageAttachment, MessageEmbed, TextBasedChannel } from "discord.js";
import { TriviaQuestion } from "easy-trivia";
import TriviaGame from "../../Classes/TriviaGame";
import {
  multipleChoiceButtonRow,
  booleanChoiceButtonRow,
} from "../../Components/messageButtons";
import generateLeaderboard from "../../Utility/generateLeaderboard";
import createQuestionImage from "../CanvasFunctions/createQuestionImage";

const letters = ["🇦", "🇧", "🇨", "🇩"];

const emitQuestion = async (
  game: TriviaGame,
  channel: TextBasedChannel,
  q: TriviaQuestion
) => {
  let correctAnswer: number;
  const choices = q.allAnswers
    .map((ans, i) => {
      if (q.checkAnswer(ans)) correctAnswer = i;
      return q.type == "multiple" ? `${letters[i]} ${ans}` : `\`${ans}\``;
    })
    .join("\n");

  const buffer = await createQuestionImage(q);
  const embed = new MessageEmbed()
    .setThumbnail(
      "https://media.discordapp.net/attachments/933214093450555463/933550211517808721/trivia_2.png?width=609&height=609"
    )
    .setTitle("New Question")
    .setColor(game.manager.theme)
    .setImage("attachment://test.png")
    .setFooter({
      text: "Use the buttons below to answer",
    });
  const attachment = new MessageAttachment(buffer, "test.png");
  return new Promise(async (resolve, reject) => {
    await channel.send({
      embeds: [embed],
      files: [attachment],
      components:
        q.type == "multiple"
          ? [multipleChoiceButtonRow]
          : [booleanChoiceButtonRow],
    });

    const collector = channel.createMessageComponentCollector({
      time: game.options.timePerQuestion || TriviaGame.defaults.timePerQuestion,
    });

    collector.on("collect", async (int) => {
      const player = game.data.players.get(int.user.id);
      const answer = q.allAnswers[Number(int.customId)];
      const isCorrect = q.checkAnswer(answer);

      if (!player) {
        if (int.replied) {
          await int.followUp({
            content: "You are not apart of this game",
            ephemeral: true,
          });
        } else {
          await int.reply({
            content: "You are not apart of this game",
            ephemeral: true,
          });
        }

        return;
      }

      if (player.hasAnswered) {
        if (int.replied) {
          await int.followUp({
            content: "You have already locked in an answer",
            ephemeral: true,
          });
        } else {
          await int.reply({
            content: "You have already locked in an answer",
            ephemeral: true,
          });
        }

        return;
      } else {
        player.hasAnswered = true;
        int.reply({
          content: `**${player.member.displayName}** has locked in!`,
        });

        if (isCorrect) {
          player.points++;
          player.isCorrect = true;
        } else {
          player.isCorrect = false;
        }
      }
    });

    collector.on("end", async (collected, r) => {
      game.data.players
        .filter((p) => p.hasAnswered)
        .forEach((p) => {
          p.hasAnswered = false;
          p.isCorrect = false;
        });

      const embed = generateLeaderboard(Array.from(game.data.players.values()));
      channel.send({
        embeds: [embed],
      });
    });
  });
};

export default emitQuestion;
