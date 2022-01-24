import { createCanvas } from "canvas";
import { TriviaQuestion } from "easy-trivia";
import getLines from "./getLines";

const createQuestionImage = async (question: TriviaQuestion) => {
  const canvas = createCanvas(500, 500);
  const ctx = canvas.getContext("2d");

  ctx.font = "30px Impact";
  ctx.fillStyle = "rgba(0,0,0,1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = "30px Impact";
  ctx.fillStyle = "rgba(255,255,255,1)";
  ctx.fillText(getLines(ctx, question.value, canvas.width - 50), 0, 50);

  return canvas.toBuffer();
};

export default createQuestionImage;
