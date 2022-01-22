import { TextBasedChannel } from "discord.js";
import { TriviaQuestion } from "easy-trivia";
import TriviaGame from "../Classes/TriviaGame";
import { promisify } from "util";
import emitQuestion from "./emitQuestion";

const wait = promisify(setTimeout);

const startGame = async(game:TriviaGame, channel: TextBasedChannel, questions:TriviaQuestion[]) => {
  const embed = (game.options.gameMessages || TriviaGame.defaults.gameMessages).gameEmbedReady;
  await channel.send({
    embeds: [embed]
  });

  await wait(5000); //Bluepaw said this took too long

  let i = 0;
  function prepareNextQuestion() {
    setTimeout(() => {
      const q = questions[i++];
      emitQuestion(game, channel, q);
      prepareNextQuestion();
    }, i == 0 
      ? 0 
      : game.options.timePerQuestion || TriviaGame.defaults.timePerQuestion);
  }

  prepareNextQuestion();

  // Wrap up game
};

export default startGame;