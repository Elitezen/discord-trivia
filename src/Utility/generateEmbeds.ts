import { MessageEmbed } from "discord.js";
import { TriviaCategoryResolvable } from "easy-trivia";
import TriviaGame from "../Classes/TriviaGame";
import { TriviaGameOptions } from "../Typings/interfaces";

const placeHolderAuthor =
  "https://media.discordapp.net/attachments/933214093450555463/933550211517808721/trivia_2.png?width=609&height=609";

const generateEmbeds = {
  gameQueueStart: (game: TriviaGame): MessageEmbed => {
    const { options } = game;
    const embed = new MessageEmbed()
      .setAuthor({
        name: "Powered By discord-trivia",
        iconURL: placeHolderAuthor,
        url: "https://github.com/Elitezen/discord-trivia",
      })
      .setColor(game.manager.theme)
      .setTitle("Trivia Game Incoming")
      .setDescription("A trivia game has been created!")
      .setThumbnail(placeHolderAuthor)
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
      });

    return embed;
  },
};

export default generateEmbeds;
