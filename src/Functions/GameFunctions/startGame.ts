import {
  getQuestions,
  TriviaQuestionDifficulty,
  TriviaQuestionType,
} from "easy-trivia";
import TriviaGame from "../../Classes/TriviaGame";

export default async function startGame(game: TriviaGame) {
  const {
    questionAmount: amount,
    questionDifficulty: difficulty,
    questionType: type,
  } = game.options;

  const questions = await getQuestions({
    amount,
    difficulty: difficulty as TriviaQuestionDifficulty,
    type: type as TriviaQuestionType,
  });

  game.channel.send({
    embeds: [game.embeds.gameQueueStart()],
  });

  console.log("Procedure End");
}
