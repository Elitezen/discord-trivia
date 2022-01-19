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

const startComponentCollector = async(game:TriviaGame, guild:Guild, channel:TextBasedChannel) => {
  const queueEmbed = new MessageEmbed()
    .setTitle('TITLE HERE')
    .setColor('BLUE') // Allow 'theme' option for <TriviaManagerOptions> as a Disocrd.JS <ColorResolvable> and use here
    .setDescription('DESC. HERE')
    .setFooter({
      text: 'FOOTER HERE'
    });
  const queueMessage = await channel.send({
    embeds: [queueEmbed],
    components: [
      new MessageActionRow()
        .addComponents(joinButton)
    ]
  });

  const filter = (i:MessageComponentInteraction) => i.customId == 'join';
  const collector = channel.createMessageComponentCollector({
    filter,
    time: game.options.queueTime
  });

  collector.on('collect', async int => {
    if (game.data.players.has(int.user.id)) {
      const inQueueAlready: InteractionReplyOptions = {
        content: `**<ALREADY QUEUED UP> ${int.user.username}!**`,
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
        content: `You have joined the queue`,
        ephemeral: true
      };

      if (int.replied) {
        await int.followUp(queuedNotification);
      } else {
        await int.reply(queuedNotification);
      }

      await channel.send({
        content: `**${int.user.username} <HAS JOINED QUEUE>**`
      });

      if (game.data.players.size == game.options.maxPlayerCount) {
        await queueMessage.edit({
          embeds: [
            queueEmbed
              .setFooter({ text: '<QUEUE NOW FULL>' })
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