import { MessageEmbed } from "discord.js";
import { TriviaPlayer } from "../Typings/interfaces";

function generateLeaderboard(players: TriviaPlayer[], baseEmbed: MessageEmbed): MessageEmbed {
  for(const player of players){
      baseEmbed.addField(player.member.displayName, `Points: \`${player.points}\``)
  }
  return baseEmbed;    
}

export default generateLeaderboard;