import { Collection, User } from "discord.js";

const correctPoints = {
    1: 5,
    2: 3,
    3: 2,
    4: 3,
    5: 2,
    all: 1
}

export default class Leaderboard {
    players: Collection<User, number>;

    constructor() {
        this.players = new Collection();
    }

    addCount(player: User, correct: boolean) {
        //@ts-expect-error
        const points = correct ? (correctPoints[this.players.size] || correctPoints.all) : 0;
        if (!this.players.has(player)) this.players.set(player, Date.now());

        return points;
    }
}