import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

/**
 * Returns the Action Row of multiple choice buttons.
 * @param {ButtonStyle} style
 * @returns {ActionRowBuilder<ButtonBuilder>}
 */
const buttonRowChoicesMultiple = (
  builders: ButtonBuilder[]
): ActionRowBuilder<ButtonBuilder> => {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    builders.map((btn, i) => btn.setCustomId(`${i}`))
  );
};

const buttonRowChoicesBoolean = (builders: ButtonBuilder[]) => {
  return new ActionRowBuilder<ButtonBuilder>().addComponents([
    // True Button
    builders[0].setCustomId("1"),

    // False Button
    builders[1].setCustomId("0"),
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