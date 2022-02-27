import { 
  Guild, 
  InteractionReplyOptions, 
  MessageActionRow, 
  MessageComponentInteraction,
  TextBasedChannel 
} from "discord.js";
import { getQuestions, TriviaQuestionDifficulty, TriviaQuestionType } from "easy-trivia";
import constants from "../../constants";
import TriviaGame from "../Classes/TriviaGame";
import { joinButton } from '../Components/messageButtons';
import { TriviaPlayer } from "../Typings/interfaces";
import ReplaceOptions, { ReplaceOptionsEmbed } from "./replaceOptions";
import startGame from "./startGame";
import verifyButton from "../Utility/verifyButton";

const startComponentCollector = async(game:TriviaGame, guild:Guild, channel:TextBasedChannel) => {
  const messages = game.options.gameMessages || TriviaGame.defaults.gameMessages;
  const queueEmbed = messages.gameEmbed;
  const button = messages.joinButton || joinButton;

  const queueMessage = await channel.send({
    embeds: [queueEmbed],
    components: [
      new MessageActionRow()
        .addComponents(verifyButton(button, {
          noLink: true,
          customId: constants.libraryDefaults.defaultJoinButtonCustomId
        }))
    ]
  });

  const filter = (i:MessageComponentInteraction) => i.customId == constants.libraryDefaults.defaultJoinButtonCustomId; //Maybe add a `customFilter` option in the future
  const collector = channel.createMessageComponentCollector({
    filter,
    time: game.options.queueTime
  });

  collector.on('collect', async int => {
    if (game.data.players.has(int.user.id)) {
      const inQueueAlready: InteractionReplyOptions = {
        content: ReplaceOptions(messages.alreadyJoined, { user: int.user }),
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
        content: ReplaceOptions(messages.joinedQueue, { user: int.user }),
        ephemeral: true
      };

      if (int.replied) {
        await int.followUp(queuedNotification);
      } else {
        await int.reply(queuedNotification);
      }

      await channel.send({
        content: ReplaceOptions(messages.playerJoinedQueue, { user: int.user })
      });

      if (game.data.players.size == game.options.maxPlayerCount) {
        await queueMessage.edit({
          embeds: [
              ReplaceOptionsEmbed(messages.gameEmbedReady, { user: int.user })
          ],
          components: [
            new MessageActionRow()
              .addComponents(verifyButton(button, {
                noLink: true,
                disabled: true,
                customId: constants.libraryDefaults.defaultJoinButtonCustomId
              }))
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
      try {
        const questions = await getQuestions({
          amount: game.options.questionAmount as number,
          difficulty: game.options.questionDifficulty as TriviaQuestionDifficulty,
          type: game.options.questionType as TriviaQuestionType
        })
      
        await startGame(game, channel, questions);
      } catch (err) {
        throw err;
      }
    }
  }); 
};

export default startComponentCollector;