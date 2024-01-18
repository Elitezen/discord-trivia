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
    Ended,
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
     * Emitted when a player joins the game.
     */
    PlayerJoin = "memberJoin",
  
    /**
     * Emitted when the game has ended.
     */
    End = "end",
  }