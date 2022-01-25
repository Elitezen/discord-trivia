import { MessageEmbed } from "discord.js";
import { TriviaCategoryResolvable } from "easy-trivia";
import constants from "../../constants";
import TriviaGame from "../Classes/TriviaGame";
import { TriviaGameOptions } from "../Typings/interfaces";
const {
  icon,
  libraryDefaults,
  urls
} = constants;

const generateEmbeds = {
  gameQueueStart: (game: TriviaGame): MessageEmbed => {
    const { options } = game;
    const embed = new MessageEmbed()
      .setAuthor(libraryDefaults.author)
      .setColor(game.manager.theme)
      .setTitle("Trivia Game Incoming")
      .setDescription("A trivia game has been created!")
      .setThumbnail(icon)
      .addFields(
        {
          name: "Category",
          value: options.triviaCategory || "Randomized",
          inline: true,
        },
        {
          name: "Difficulty",
          value: options.questionDifficulty || "Mixed",
          inline: true,
        },
        {
          name: "Maximum Players",
          value: options.maxPlayerCount.toString(),
          inline: true,
        }
      )
      .setFooter({
        text: "Use the buttons below to interact",
        iconURL: "https://cdn.discordapp.com/emojis/935296239858241577.png?size=96&quality=lossless"
      });

    return embed;
  },
};

export default generateEmbeds;
