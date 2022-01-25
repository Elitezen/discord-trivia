import { MessageEmbed, TextBasedChannel } from "discord.js";
import { TriviaQuestion } from "easy-trivia";
import TriviaGame from "../../Classes/TriviaGame";
import { promisify } from "util";
import emitQuestion from "./emitQuestion";
import constants from "../../../constants";
import Leaderboard from "../../Utility/leaderboard";

const wait = promisify(setTimeout);

const startGame = async (
  game: TriviaGame,
  channel: TextBasedChannel,
  questions: TriviaQuestion[]
) => {
  const embed = new MessageEmbed()
    .setTitle("Trivia Game Now Starting...")
    .setColor(game.manager.theme)
    .setDescription("Get Ready! The game is about to start.")
    .setThumbnail(
      constants.icon
    )
    //.setImage("https://c.tenor.com/IrwiUh_zsNUAAAAC/bugs-bunny-race.gif")
    .setFooter({
      text: "Game will begin momentarily",
    });
  await channel.send({
    embeds: [embed],
  });

  await wait(5000); //Bluepaw said this took too long

  const counter = new Leaderboard();

  let i = 0;
  function prepareNextQuestion() {
    setTimeout(
      () => {
        const q = questions[i++];
        emitQuestion(game, channel, q, counter);
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
