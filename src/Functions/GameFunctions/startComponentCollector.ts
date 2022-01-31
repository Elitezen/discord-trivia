import {
  InteractionReplyOptions,
  MessageActionRow,
  MessageComponentInteraction,
} from "discord.js";
import TriviaGame from "../../Classes/TriviaGame";
import { joinButton } from "../../Components/GameComponents/messageButtons";
import { TriviaPlayer } from "../../Typings/interfaces";
import startGame from "./startGame";

async function reply(
  int: MessageComponentInteraction,
  obj: InteractionReplyOptions
) {
  if (int.replied) {
    await int.followUp(obj);
  } else {
    await int.reply(obj);
  }
}

export default async function startComponentCollector(game: TriviaGame) {
  const queueMessage = await game.channel.send({
    embeds: [game.embeds.gameQueueStart()],
    components: [new MessageActionRow().addComponents([joinButton])],
  });

  const collector = game.channel.createMessageComponentCollector({
    time: game.options.queueTime,
  });

  collector.on("collect", async (int) => {
    if (game.players.has(int.user.id)) {
      const inQueueAlready: InteractionReplyOptions = {
        content: "**You are already in the queue**",
        ephemeral: true,
      };

      await reply(int, inQueueAlready);
    } else {
      const member = await game.guild.members.fetch(int.user.id);
      if (!member) {
        reply(int, {
          content: "Failed to enter you into the queue, please try again",
          ephemeral: true,
        });

        return;
      }

      const joinedQueue: InteractionReplyOptions = {
        content: "Successfully joined queue",
        ephemeral: true,
      };

      await reply(int, joinedQueue);

      const player: TriviaPlayer = Object.assign(member, {
        points: 0,
        hasAnswered: false,
        isCorrect: false,
        leaderboardPosition: {
          previous: 0,
          current: 0,
        },
      });

      game.players.set(player.id, player);

      await game.channel.send({
        content: `**${player.displayName}** has joined in!`,
      });

      if (game.players.size === game.options.maxPlayerCount) {
        collector.stop("Game has reached set maximum player capacity");
      }
    }
  });

  collector.on("end", async () => {
    if (queueMessage.deletable) {
      queueMessage.delete().catch((_) => null);
    }

    if (
      collector.endReason ||
      game.players.size >= game.options.minPlayerCount
    ) {
      await startGame(game);
    } else {
      game.end();

      await game.channel.send({
        content: "Game failed to meet minimum player requirements",
      });
    }
  });
}
