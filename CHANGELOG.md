# CHANGELOG

## 3.0.1

- Fixed a bug which caused any non-first correct answers to be counted as incorrect.
- Fixed a bug where games that timedout in queue were not deleted by the manager.
- The `GameEmbeds#leaderboardUpdate()` function's parameters have changed to `(leaderboard: Collection<string, Player>, lastQuestion: GameQuestion)`