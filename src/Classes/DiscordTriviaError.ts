import { DiscordTriviaErrorMessages } from "../Typings/interfaces";

export default class DiscordTriviaError extends Error {
  public static readonly errors: DiscordTriviaErrorMessages = {
    channelNonText: {
      message: "Given channel is not of type TEXT",
      header: "INTERACTION_CHANNEL_NON_TEXT",
    },
    channelNullish: {
      message: "Channel guild is not accessible to the client",
      header: "INTERACTION_CHANNEL_NULLISH",
    },
    interactionNonCommand: {
      message: "Supplied interaction is not of type CommandInteraction",
      header: "INTERACTION_NON_COMMAND",
    },
    guildNullish: {
      message: "Guild is not accessible to the client",
      header: "INTERACTION_GUILD_NULLISH",
    },
  };

  constructor(message: string, header: string) {
    if (typeof message != "string")
      throw new DiscordTriviaError(
        `Expected a string for 'message', recieved ${typeof message}`,
        "INVALID_CONSTRUCTOR_ARGUMENT"
      );
    if (typeof header != "string")
      throw new DiscordTriviaError(
        `Expected a string for 'header', recieved ${typeof header}`,
        "INVALID_CONSTRUCTOR_ARGUMENT"
      );

    super(message);
    this.name = `DiscordTriviaError [${header}]`;
  }
}
