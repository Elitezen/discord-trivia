import { Guild, TextBasedChannel } from "discord.js";
import DiscordTriviaError from "../../Classes/DiscordTriviaError";

export default function validateDiscordStructures(
  guild: Guild,
  channel: TextBasedChannel
) {
  if (guild === null) {
    const { message, header } = DiscordTriviaError.errors.guildNullish;
    throw new DiscordTriviaError(message, header);
  } else if (channel === null) {
    const { message, header } = DiscordTriviaError.errors.channelNullish;
    throw new DiscordTriviaError(message, header);
  } else if (!channel.isText()) {
    const { message, header } = DiscordTriviaError.errors.channelNonText;
    throw new DiscordTriviaError(message, header);
  }
}
