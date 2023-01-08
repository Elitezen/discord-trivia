/**
 * Represents game states.
 */
export enum GameStates {
  Pending = 0,
  Queue,
  Ended,
}

/**
 * Enum for game event names.
 */
export enum GameEvents {
  Pending = "pending",
  Queue = "queue",
  MemberJoin = "memberJoin",
  End = "end",
}
