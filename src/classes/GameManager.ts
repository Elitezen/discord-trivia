import { Collection } from "discord.js";
import Game from "./Game";

import type { Snowflake, TextBasedChannel } from "discord.js";

/**
 * Represents the manager for trivia games.
 */
export default class GameManager {
    /**
     * This manager's ongoing games.
     */
    public readonly games: Collection<Snowflake, Game> = new Collection();

    /**
     * Creates a new `Game` instance.
     * @param {TextBasedChannel} channel The channel this game is to be hosted in.
     * @returns {Game}
     */
    createGame(channel: TextBasedChannel): Game {
        return new Game(this, channel);
    }

    /**
     * Ends a game.
     * @param {Snowflake | Game} gameResolvable A game's channel id or game instance.
     * @returns {void}
     */
    endGame(gameResolvable: Snowflake | Game): void {
        const channelId =
            typeof gameResolvable == "string"
                ? gameResolvable
                : gameResolvable.channel.id;
        const game = this.games.get(channelId);

        game?.end();
    }
}
