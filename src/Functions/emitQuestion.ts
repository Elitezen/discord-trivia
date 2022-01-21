import { MessageComponentInteraction, MessageEmbed, TextBasedChannel } from "discord.js";
import { TriviaQuestion } from "easy-trivia";
import { promisify } from "util";
import TriviaGame from "../Classes/TriviaGame";
import { multipleChoiceButtonRow, booleanChoiceButtonRow } from "../Components/messageButtons";
import { ReplaceOptionsEmbed } from "./replaceOptions";

const wait = promisify(setTimeout);
const letters = ['🇦', '🇧', '🇨', '🇩'];

const emitQuestion = (game:TriviaGame, channel:TextBasedChannel, q:TriviaQuestion) => {
  let correctAnswer: number;
  const choices = q.allAnswers
    .map((ans, i) => {
      if (q.checkAnswer(ans)) correctAnswer = i;
      return q.type == 'multiple' 
      ? `${letters[i]} ${ans}` 
      : `\`${ans}\``;
    })
    .join('\n');
  const embed = new MessageEmbed(game.options.gameMessages.baseQuestionEmbed)
    .setTitle('New Question')
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
        const answer = q.allAnswers[Number(int.customId)];
        const correct = q.checkAnswer(answer);

        if(correct){
            int.reply({
              embeds: [
                ReplaceOptionsEmbed(game.options.gameMessages.correctEmbed, {
                  user: int.user
                })
              ],
              content: `${int.user}`
            });

            collector.stop(`CORRECT`);
        } else {
            int.reply({
              embeds: [
                game.options.gameMessages.incorrectEmbed
              ],
              ephemeral: true
            });
        }
    });

    // collector end
    collector.on("end", async (collected, r) => {
      //Handle this
      if(r == "CORRECT"){
        //Handle correct answer
      }
    })
  });
};

export default emitQuestion;