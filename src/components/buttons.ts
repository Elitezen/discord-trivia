import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { GameButtonIds } from "../typings/enums";

const buttonRowChoicesMultiple = (
    builders: ButtonBuilder[]
): ActionRowBuilder<ButtonBuilder> => {
    return new ActionRowBuilder<ButtonBuilder>().addComponents(
        builders.map((btn, i) => btn.setCustomId([
            GameButtonIds.QuestionOptionA,
            GameButtonIds.QuestionOptionB,
            GameButtonIds.QuestionOptionC,
            GameButtonIds.QuestionOptionD,
        ][i]))
    );
};

/**
 * Returns a row of buttons for question choices
 * @param {ButtonBuilder[]} builders
 * @returns {ActionRowBuilder<ButtonBuilder>}
 */
const buttonRowChoicesBoolean = (builders: ButtonBuilder[]) => {
    return new ActionRowBuilder<ButtonBuilder>().addComponents([
        builders[0].setCustomId(GameButtonIds.QuestionOptionTrue),
        builders[1].setCustomId(GameButtonIds.QuestionOptionFalse)
    ]);
};

/**
 * Returns the Action Row of queue buttons.
 * @param {ButtonStyle} style
 * @returns {ActionRowBuilder<ButtonBuilder>}
 */
const buttonRowQueue = (style: ButtonStyle) => {
    return new ActionRowBuilder<ButtonBuilder>().addComponents([
        new ButtonBuilder()
            .setCustomId(GameButtonIds.Join)
            .setLabel("Join")
            .setStyle(style)
    ]);
};

export { buttonRowChoicesMultiple, buttonRowChoicesBoolean, buttonRowQueue };
