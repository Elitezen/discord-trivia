import { CollectorFilter, MessageComponentInteraction } from "discord.js";
import { TriviaQuestion } from "easy-trivia";
import { promisify } from "util";
import TriviaGame from "../../Classes/TriviaGame";
const wait = promisify(setTimeout);

export default async function emitQuestion(game:TriviaGame, question:TriviaQuestion):Promise<void> {
  return new Promise(async(resolve, reject) => {
    await game.channel.send({
      embeds: [game.embeds.question(question)],
      components: [TriviaGame.buttonRows[question.type]]
    });
  
    const filter:CollectorFilter<[MessageComponentInteraction<"cached">]> = (i) => game.players.has(i.user.id);
    const collector = game.channel.createMessageComponentCollector({
      filter,
      time: game.options.timePerQuestion
    });
  
    collector.on('collect', async i => {
      const player = game.players.get(i.user.id)!;
      const member = await game.guild.members.fetch(i.user.id);

      if (question.checkAnswer(question.allAnswers[Number(i.customId)])) {
        player.points++;
      }

      await game.channel.send({
        content: `**${member.displayName || i.user.username}** has locked in!`
      });
    });
  
    collector.on('end', async() => {
      await game.channel.send({
        embeds: [game.embeds.leaderboardUpdate(game)]
      });

      await wait(5000);
      resolve();
    });
  });
}