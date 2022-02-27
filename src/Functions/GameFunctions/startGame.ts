import { MessageAttachment } from "discord.js";
import {
  getQuestions,
  TriviaQuestionDifficulty,
  TriviaQuestionType,
} from "easy-trivia";
import TriviaGame from "../../Classes/TriviaGame";
import startGameLoop from "./startGameLoop";

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

  await game.channel.send({
    embeds: [game.embeds.gameStart()],
  });

  await startGameLoop(game, questions);
}
