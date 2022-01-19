import { MessageEmbed } from "discord.js";
import { TriviaPlayer } from "../Typings/interfaces";

function generateLeaderboard(players: TriviaPlayer[], baseEmbed: MessageEmbed): MessageEmbed {
    for(const player of players){
        //@ts-expect-error
        baseEmbed.addField(player.member.nickname | player.member.user.username, `Points: \`${player.points}\``)
    }
    return baseEmbed;    
}

export {
    generateLeaderboard
}