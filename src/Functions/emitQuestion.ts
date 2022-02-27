import { MessageComponentInteraction, MessageEmbed, TextBasedChannel } from "discord.js";
import { TriviaQuestion } from "easy-trivia";
import { promisify } from "util";
import TriviaGame from "../Classes/TriviaGame";
import { multipleChoiceButtonRow, booleanChoiceButtonRow } from "../Components/messageButtons";

const wait = promisify(setTimeout);
const letters = ['🇦', '🇧', '🇨', '🇩'];

const emitQuestion = (game:TriviaGame, channel:TextBasedChannel, q:TriviaQuestion) => {
  let correctAnswer: number;
  const choices = q.allAnswers
    .map((ans, i) => {
      if (q.checkAnswer(ans)) correctAnswer = i;
      return q.type == 'multiple' 
      ? `${letters[i]} ${ans}` 
      : `**${ans.toUpperCase()}**`;
    })
    .join('\n');
  const embed = new MessageEmbed()
    .setTitle('New Question')
    .setColor('BLUE')
    .addField('Question', q.value)
    .addField('Choices', choices);
  return new Promise(async(resolve, reject) => {
    await channel.send({
      embeds: [embed],
      components: q.type == 'multiple' 
      ? [multipleChoiceButtonRow] 
      : [booleanChoiceButtonRow]
    });

    const filter = (i:MessageComponentInteraction) => game.data.players.has(i.user.id);
    const collector = channel.createMessageComponentCollector({
      filter,
      time: game.options.timePerQuestion || TriviaGame.defaults.timePerQuestion
    });

    collector.on('collect', async int => {
      
    });

    // collector end
  });
};

export default emitQuestion;