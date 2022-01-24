import { MessageEmbed, TextBasedChannel } from "discord.js";
import { TriviaQuestion } from "easy-trivia";
import TriviaGame from "../../Classes/TriviaGame";
import { promisify } from "util";
import emitQuestion from "./emitQuestion";

const wait = promisify(setTimeout);

const startGame = async (
  game: TriviaGame,
  channel: TextBasedChannel,
  questions: TriviaQuestion[]
) => {
  const embed = new MessageEmbed()
    .setTitle("Trivia Game Now Starting")
    .setColor(game.manager.theme)
    .setDescription("Get Ready!")
    .setThumbnail(
      "https://media.discordapp.net/attachments/933214093450555463/933550211517808721/trivia_2.png?width=609&height=609"
    )
    .setImage("https://c.tenor.com/IrwiUh_zsNUAAAAC/bugs-bunny-race.gif")
    .setFooter({
      text: "Game will begin momentarily",
    });
  await channel.send({
    embeds: [embed],
  });

  await wait(5000); //Bluepaw said this took too long

  let i = 0;
  function prepareNextQuestion() {
    setTimeout(
      () => {
        const q = questions[i++];
        emitQuestion(game, channel, q);
        prepareNextQuestion();
      },
      i == 0
        ? 0
        : game.options.timePerQuestion || TriviaGame.defaults.timePerQuestion
    );
  }

  prepareNextQuestion();

  // Wrap up game
};

export default startGame;
