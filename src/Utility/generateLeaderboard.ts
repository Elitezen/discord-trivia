import { ColorResolvable, MessageEmbed } from "discord.js";
import { TriviaPlayer } from "../Typings/interfaces";

function generateLeaderboard(players: TriviaPlayer[], color: ColorResolvable = "BLURPLE"): MessageEmbed {
  const list = players
    .map((p, i) => {
      p.leaderboardPosition.previous = i;
      return p;
    })
    .sort((a, b) => a.points - b.points)
    .map((p, i) => {
      const { previous, current } = p.leaderboardPosition;
      let change = "";
      if (current != previous) {
        current > previous ? "⬆️" : "⬇️";
      }

      p.leaderboardPosition.current = i;
      return `${p.points} **${p.member.displayName}** ${
        p.isCorrect ? "+1" : "-"
      } ${current} ${change}`;
    })
    .join("\n");
  const embed = new MessageEmbed().setTitle("Leaderboard").setDescription(list).setColor(color);
  return embed;
}

export default generateLeaderboard;
