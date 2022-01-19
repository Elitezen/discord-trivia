import { 
  Guild, 
  InteractionReplyOptions, 
  MessageActionRow, 
  MessageComponentInteraction, 
  MessageEmbed, 
  TextBasedChannel 
} from "discord.js";
import { getQuestions, TriviaQuestionDifficulty, TriviaQuestionType } from "easy-trivia";
import TriviaGame from "../Classes/TriviaGame";
import { joinButton, joinButtonDisabled } from '../Components/messageButtons';
import { TriviaPlayer } from "../Typings/interfaces";
import ReplaceOptions, { ReplaceOptionsEmbed } from "./replaceOptions";

const startComponentCollector = async(game:TriviaGame, guild:Guild, channel:TextBasedChannel) => {
  const queueEmbed = game.options.gameMessages.gameEmbed;
  const queueMessage = await channel.send({
    embeds: [queueEmbed],
    components: [
      new MessageActionRow()
        .addComponents(joinButton)
    ]
  });

  const filter = (i:MessageComponentInteraction) => i.customId == 'join'; //Maybe add a `customFilter` option in the future
  const collector = channel.createMessageComponentCollector({
    filter,
    time: game.options.queueTime
  });

  collector.on('collect', async int => {
    if (game.data.players.has(int.user.id)) {
      const inQueueAlready: InteractionReplyOptions = {
        content: ReplaceOptions(game.options.gameMessages.alreadyJoined, { user: int.user }),
        ephemeral: true
      };

      if (int.replied) {
        await int.followUp(inQueueAlready);
      } else {
        await int.reply(inQueueAlready);
      }
    } else {
      const member = await guild.members.fetch(int.user.id);
      if (!member) return; // Throw Error

      const player: TriviaPlayer = {
        member,
        points: 0
      };

      game.data.players.set(member.id, player);

      const queuedNotification: InteractionReplyOptions = {
        content: ReplaceOptions(game.options.gameMessages.joinedQueue, { user: int.user }),
        ephemeral: true
      };

      if (int.replied) {
        await int.followUp(queuedNotification);
      } else {
        await int.reply(queuedNotification);
      }

      await channel.send({
        content: ReplaceOptions(game.options.gameMessages.playerJoinedQueue, { user: int.user })
      });

      if (game.data.players.size == game.options.maxPlayerCount) {
        await queueMessage.edit({
          embeds: [
              ReplaceOptionsEmbed(game.options.gameMessages.gameEmbedReady, { user: int.user })
          ],
          components: [
            new MessageActionRow()
              .addComponents(joinButtonDisabled)
          ]
        });
      }
    }
  });

  collector.on('end', async _ => {
    if (game.data.players.size < (game.options.minPlayerCount as number)) {
      // game.end();

      await channel.send({
        content: 'Game failed to meet minimum player requirements'
      });
    } else {
      console.log(await getQuestions({
        amount: game.options.questionAmount as number,
        difficulty: game.options.questionDifficulty as TriviaQuestionDifficulty,
        type: game.options.questionType as TriviaQuestionType
      }));
      // initGame();
    }
  }); 
};

export default startComponentCollector;