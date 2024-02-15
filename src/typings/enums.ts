/**
 * Represents game states.
 */
export enum GameStates {
    /**
     * Represents a game that has been instantiated and has yet to begin it's queue.
     */
    Pending = 0,

    /**
     * Represents a game during it's queue.
     */
    Queue,

    /**
     * Represents a game that has ended.
     */
    Ended
}

/**
 * Enum for game event names.
 */
export enum GameEvents {
    /**
     * Emitted when the game is instantiated.
     */
    Pending = "pending",

    /**
     * Emitted when the game's queue has started.
     */
    Queue = "queue",

    /**
     * Emitted when a question is sent.
     */
    QuestionEmit = "questionEmit",

    /**
     * Emitted when a player joins the game.
     */
    PlayerJoin = "memberJoin",

    /**
     * Emitted when the game has ended.
     */
    End = "end"
}

/**
 * Mapping of question identifier to their string id.
 */
export enum GameButtonIds {
    Join = "join",
    QuestionOptionFalse = "false",
    QuestionOptionTrue = "true",
    QuestionOptionA = "a",
    QuestionOptionB = "b",
    QuestionOptionC = "c",
    QuestionOptionD = "d"
}

/**
 * Reasons for a queue collector's end, excluding scenarious handled by Discord.JS.
 */
export enum QueueCollectorEndReason {
    /**
     * Whenever the player count reaches the maximum amount as per game configuration.
     */
    MaxPlayersReached = "PLAYER_LIMIT_REACHED"
}
