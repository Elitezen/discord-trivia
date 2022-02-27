import { TriviaQuestion } from "easy-trivia";
import TriviaGame from "../../Classes/TriviaGame"
import { promisify } from "util";
import emitQuestion from "./emitQuestion";
const wait = promisify(setTimeout);

export default async function startGameLoop(game: TriviaGame, questions:TriviaQuestion[]) {
  for await (const question of questions) {
    await game.channel.send({
      content: '**Preparing the next question...**'
    });

    await wait(5000);

    await emitQuestion(game, question);
  }
}