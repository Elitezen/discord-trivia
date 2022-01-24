export default class DiscordTriviaError extends Error {
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
