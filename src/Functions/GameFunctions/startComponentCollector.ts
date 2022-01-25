import {
  Guild,
  InteractionReplyOptions,
  MessageActionRow,
  TextBasedChannel,
} from "discord.js";
import {
  getQuestions,
  TriviaQuestionDifficulty,
  TriviaQuestionType,
} from "easy-trivia";
import TriviaGame from "../../Classes/TriviaGame";
import { joinButton } from "../../Components/messageButtons";
import { TriviaPlayer } from "../../Typings/interfaces";
import ReplaceOptions from "../../Utility/replaceOptions";
import startGame from "./startGame";
import generateEmbeds from "../../Utility/generateEmbeds";

const startComponentCollector = async (
  game: TriviaGame,
  guild: Guild,
  channel: TextBasedChannel
) => {
  const { messages } = game.manager;
  const queueMessage = await channel.send({
    embeds: [generateEmbeds.gameQueueStart(game)],
    components: [new MessageActionRow().addComponents([joinButton])],
  });

  const collector = channel.createMessageComponentCollector({
    time: game.options.queueTime,
  });

  collector.on("collect", async (int) => {
    if (game.data.players.has(int.user.id)) {
      const inQueueAlready: InteractionReplyOptions = {
        content: ReplaceOptions(messages.alreadyJoined, { user: int.user }),
        ephemeral: true,
      };

      if (int.replied) {
        await int.followUp(inQueueAlready);
      } else {
        await int.reply(inQueueAlready);
      }
    } else {
      const member = await guild.members.fetch(int.user.id);
      if (!member) return; // Throw Error

      if (int.replied) {
        await int.followUp({
          content: "You have joined the queue",
          ephemeral: true,
        });
      } else {
        await int.reply({
          content: "You have joined the queue",
          ephemeral: true,
        });
      }

      const player: TriviaPlayer = {
        member,
        points: 0,
        hasAnswered: false,
        isCorrect: false,
        leaderboardPosition: {
          previous: 0,
          current: 0,
        },
      };

      game.data.players.set(member.id, player);

      await channel.send({
        content: ReplaceOptions(messages.playerJoinedQueue, { user: int.user }),
      });

      if (game.data.players.size == game.options.maxPlayerCount) {
        await queueMessage.edit({
          components: [
            new MessageActionRow().addComponents([
              joinButton.setDisabled(true),
            ]),
          ],
        });
      }
    }
  });

  collector.on("end", async (_) => {
    if (game.data.players.size < (game.options.minPlayerCount as number)) {
      // game.end();

      await channel.send({
        content: "Game failed to meet minimum player requirements",
      });
    } else {
      try {
        //Sometimes it does not edit
        await queueMessage.edit({
          components: [
            new MessageActionRow().addComponents([
              joinButton.setDisabled(true),
            ]),
          ],
        });
        
        const questions = await getQuestions({
          amount: game.options.questionAmount as number,
          difficulty: game.options
            .questionDifficulty as TriviaQuestionDifficulty,
          type: game.options.questionType as TriviaQuestionType,
        });

        await startGame(game, channel, questions);
      } catch (err) {
        throw err;
      }
    }
  });
};

export default startComponentCollector;
