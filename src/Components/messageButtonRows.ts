import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

/**
 * Returns the Action Row of multiple choice buttons.
 * @param {ButtonStyle} style
 * @returns {ActionRowBuilder<ButtonBuilder>}
 */
const buttonRowChoicesMultiple = (
  style: ButtonStyle
): ActionRowBuilder<ButtonBuilder> => {
  return new ActionRowBuilder<ButtonBuilder>().addComponents([
    new ButtonBuilder().setCustomId("0").setLabel("A").setStyle(style),
    new ButtonBuilder().setCustomId("1").setLabel("B").setStyle(style),
    new ButtonBuilder().setCustomId("2").setLabel("C").setStyle(style),
    new ButtonBuilder().setCustomId("3").setLabel("D").setStyle(style),
  ]);
};

/**
 * Returns the Action Row of boolean buttons.
 * @param {ButtonStyle} style
 * @returns {ActionRowBuilder<ButtonBuilder>}
 */
const buttonRowChoicesBoolean = (style: ButtonStyle) => {
  return new ActionRowBuilder<ButtonBuilder>().addComponents([
    new ButtonBuilder().setCustomId("1").setLabel("True").setStyle(style),
    new ButtonBuilder()
      .setCustomId("0")
      .setLabel("False")
      .setStyle(ButtonStyle.Danger),
  ]);
};

/**
 * Returns the Action Row of queue buttons.
 * @param {ButtonStyle} style
 * @returns {ActionRowBuilder<ButtonBuilder>}
 */
const buttonRowQueue = (style: ButtonStyle) => {
  return new ActionRowBuilder<ButtonBuilder>().addComponents([
    new ButtonBuilder().setCustomId("1").setLabel("Join").setStyle(style),
  ]);
};

export { buttonRowChoicesMultiple, buttonRowChoicesBoolean, buttonRowQueue };
