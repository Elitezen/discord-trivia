import { Collection } from "discord.js";

import type { Snowflake, TextBasedChannel } from "discord.js";
import Game from "./Game";

export default class GameManager {
    public readonly games: Collection<Snowflake, any> = new Collection();

    constructor() {}

    createGame(channel: TextBasedChannel) {
        return new Game(this, channel);
    }
}