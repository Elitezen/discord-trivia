import {
  ActionRowBuilder,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  TextInputBuilder,
} from "@discordjs/builders";
import { TextInputStyle } from "discord.js";

const modal = new ModalBuilder()
  .setCustomId("getoptions")
  .setTitle("Set The Game Options. Leave Values Blank for Random.");

const amountInput = new TextInputBuilder()
  .setCustomId("amount")
  .setLabel("Enter the amount of questions (1-50):")
  .setStyle(TextInputStyle.Short);
const categoryInput = new TextInputBuilder()
  .setCustomId("category")
  .setLabel("Enter a category name or ID:")
  .setStyle(TextInputStyle.Short);
const difficultyInput = new TextInputBuilder()
  .setCustomId("difficulty")
  .setLabel("Enter a difficulty (easy, medium, or hard):")
  .setStyle(TextInputStyle.Short);
const typeInput = new TextInputBuilder()
  .setCustomId("type")
  .setLabel("Enter a difficulty (boolean or multiple):")
  .setStyle(TextInputStyle.Short);

const firstActionRow =
  new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
    amountInput
  );
const secondActionRow =
  new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
    categoryInput
  );
const thirdActionRow =
  new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
    difficultyInput
  );
const fourthActionRow =
  new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
    typeInput
  );

modal.addComponents(
  firstActionRow,
  secondActionRow,
  thirdActionRow,
  fourthActionRow
);

export default modal;
