import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

const buttonRowChoicesMultiple =
  new ActionRowBuilder<ButtonBuilder>().addComponents([
    new ButtonBuilder()
      .setCustomId("0")
      .setLabel("A")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId("1")
      .setLabel("B")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId("2")
      .setLabel("C")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId("3")
      .setLabel("D")
      .setStyle(ButtonStyle.Primary),
  ]);

const buttonRowChoicesBoolean =
  new ActionRowBuilder<ButtonBuilder>().addComponents([
    new ButtonBuilder()
      .setCustomId("1")
      .setLabel("True")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId("0")
      .setLabel("False")
      .setStyle(ButtonStyle.Danger),
  ]);

const buttonRowQueue = new ActionRowBuilder<ButtonBuilder>().addComponents([
  new ButtonBuilder()
    .setCustomId("1")
    .setLabel("Join")
    .setStyle(ButtonStyle.Success),
]);

const buttonRowChoicesMultipleDisabled =
  new ActionRowBuilder<ButtonBuilder>().addComponents([
    new ButtonBuilder()
      .setCustomId("0")
      .setLabel("A")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(true),
    new ButtonBuilder()
      .setCustomId("1")
      .setLabel("B")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(true),
    new ButtonBuilder()
      .setCustomId("2")
      .setLabel("C")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(true),
    new ButtonBuilder()
      .setCustomId("3")
      .setLabel("D")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(true),
  ]);

const buttonRowChoicesBooleanDisabled =
  new ActionRowBuilder<ButtonBuilder>().addComponents([
    new ButtonBuilder()
      .setCustomId("1")
      .setLabel("True")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(true),
    new ButtonBuilder()
      .setCustomId("0")
      .setLabel("False")
      .setStyle(ButtonStyle.Danger)
      .setDisabled(true),
  ]);

const buttonRowQueueDisabled =
  new ActionRowBuilder<ButtonBuilder>().addComponents([
    new ButtonBuilder()
      .setCustomId("1")
      .setLabel("Join")
      .setStyle(ButtonStyle.Success)
      .setDisabled(true),
  ]);

export { buttonRowChoicesMultiple, buttonRowChoicesBoolean, buttonRowQueue };

export const Disabled = {
  buttonRowChoicesMultipleDisabled,
  buttonRowChoicesBooleanDisabled,
  buttonRowQueueDisabled,
};
