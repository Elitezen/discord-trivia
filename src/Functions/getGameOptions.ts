import { CommandInteraction } from "discord.js";
import modal from "../Components/getGameOptionsModal";
import { GameQuestionOptions } from "../Typings/interfaces";

const FIVE_MINUTES = 1_000 * 60 * 5;

export default async function getGameOptions(interaction:CommandInteraction):Promise<Omit<GameQuestionOptions, 'customQuestions'>> {
  await interaction.showModal(modal);
  const modalSubmitInteraction = await interaction.awaitModalSubmit({
    time: FIVE_MINUTES
  });

  const amountInput:string | undefined = modalSubmitInteraction.fields.getTextInputValue('amount');
  const categoryInput:string | undefined = modalSubmitInteraction.fields.getTextInputValue('category');
  const difficultyInput:string | undefined = modalSubmitInteraction.fields.getTextInputValue('difficulty');
  const typeInput:string | undefined = modalSubmitInteraction.fields.getTextInputValue('type');

  return {
    amount: amountInput,
    category: categoryInput,
    difficulty: difficultyInput,
    type: typeInput
  }
}