import { MessageEmbed } from "discord.js";
import TriviaGame from "../Classes/TriviaGame";

const baseEmbeds = {
  // gameStartEmbed: new MessageEmbed()
  //   .setAuthor({
  //     name: 'Powered By discord-trivia',
  //     iconURL: placeHolderAuthor,
  //     url: 'https://github.com/Elitezen/discord-trivia'
  //   })
  //   .setTitle('Preparing Trivia Game')
  //     .setColor(TriviaGame.BaseColor)
  //     .setDescription('A new trivia game is starting!')
  //     .setFooter({
  //       text: 'Use the button to interact'
  //     }),
  // gameReadyEmbed: new MessageEmbed()
  //   .setTitle(`Trivia Game Started`)
  //   .setColor(TriviaGame.BaseColor)
  //   .setDescription('Queue has finalized, the game will begin shortly')
};

export default baseEmbeds;
