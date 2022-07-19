import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

// The following errors occure without :any
// The inferred type of '...' cannot be named without a reference to 'discord.js/node_modules/discord-api-types/v9'. This is likely not portable. A type annotation is necessary.
const buttonRowChoicesMultiple:any = new ActionRowBuilder().addComponents([
  new ButtonBuilder().setCustomId("0").setLabel("A").setStyle(ButtonStyle.Primary),
  new ButtonBuilder().setCustomId("1").setLabel("B").setStyle(ButtonStyle.Primary),
  new ButtonBuilder().setCustomId("2").setLabel("C").setStyle(ButtonStyle.Primary),
  new ButtonBuilder().setCustomId("3").setLabel("D").setStyle(ButtonStyle.Primary),
]);

const buttonRowChoicesBoolean:any = new ActionRowBuilder().addComponents([
  new ButtonBuilder().setCustomId("1").setLabel("True").setStyle(ButtonStyle.Primary),
  new ButtonBuilder().setCustomId("0").setLabel("False").setStyle(ButtonStyle.Danger),
]);

const buttonRowQueue:any = new ActionRowBuilder().addComponents([
  new ButtonBuilder().setCustomId("1").setLabel("Join").setStyle(ButtonStyle.Success),
]);

const buttonRowChoicesMultipleDisabled = new ActionRowBuilder().addComponents([
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

const buttonRowChoicesBooleanDisabled = new ActionRowBuilder().addComponents([
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

const buttonRowQueueDisabled = new ActionRowBuilder().addComponents([
  new ButtonBuilder()
    .setCustomId("1")
    .setLabel("Join")
    .setStyle(ButtonStyle.Success)
    .setDisabled(true),
]);

export { buttonRowChoicesMultiple, buttonRowChoicesBoolean, buttonRowQueue };

// The following error occures without :any
// The inferred type of 'Disabled' cannot be named without a reference to 'discord.js/node_modules/discord-api-types/v9'. This is likely not portable. A type annotation is necessary.
export const Disabled:any = {
  buttonRowChoicesMultipleDisabled,
  buttonRowChoicesBooleanDisabled,
  buttonRowQueueDisabled,
};
