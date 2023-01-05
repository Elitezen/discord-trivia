/**
 * A library based error.
 * @extends TypeError
 */
export default class DiscordTriviaError extends TypeError {
  constructor(message: string) {
    super(message);
    this.name = `DiscordTriviaError`;
  }
}
