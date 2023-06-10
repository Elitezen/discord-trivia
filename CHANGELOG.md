# CHANGELOG

## 2.0.3
- Fixed bug causing error message "Invalid Root!"
- Compilation now targets ES2020

## 2.0.0
  - Removed `TriviaCommandBuilder` as it's usage was verbose. I am waiting for Discord to allow implementation of select menus into modals to create a successor.
  - `TriviaGame.start()` has been renamed to `TriviaGame.setup()` 
  - Configuration of a `TriviaGame` is now done through:
    - `game.decorate(options: DecorationOptions)`
    - `game.setQuestionOptions(options: Omit<GameQuestionOptions, "customQuestions">)`
    - `game.setGameOptions(options: Partial<GameOptions>)`
    - Option names containing "maximum" or "minimum" have been reduced to  "max" and "min"
  - Adding custom questions is now done through `game.setCustomQuestions(questions: (
      CustomQuestion<QuestionTypes>
      | BooleanQuestion
      | MultipleChoiceQuestion
    )[])`
  - Package now uses open-trivia-db 2.1.5 which has reverted back to node-fetch@2 to support NodeJS < 18

- Editing the game's output messages can now be done through `game.setGameTexts(options: Partial<GameOptions>)`

- Trivia games now automatically move on to the next step once the queue has filled up or everyone has answered

- You can now edit the following using `game.decorate()`:
  - Button styles
  - Embed thumbnail

- Custom questions can now be created with the `CustomQuestionBuilder.Boolean()` and `CustomQuestionBuilder.Multiple()` classes

- This package now "echoes" `CategoryNames`, `QuestionDifficulties`, and `QuestionTypes` from open-trivia-db for usage in discord-trivia

- Trivia games no longer send a new message after every user interaction. Embeds will now update to reflect any new data

- Updated to latest versions of discord.js, open-trivia-db, and discord-api-types

## 1.2.3
- Fixed issue of GUILD_NON_TEXT in text channels.
- Addressed issue of games now being able to start with 0 players.
- Re-added prettier as a dev dependency

## 1.2.2
- Many bug fixes regarding the converstion to DJS v14.
- Fixed error of requiring optional QuestionData options when 1 other option was provided.
- Changed RootComponent to utilize DJS's Enums.

## 1.2.1 
- Fixed typo where options for difficulty option in TriviaCommandBuilder were all "Easy"

## 1.2.0 (Breaking Change)
- Updated module to work with Discord.JS v14. **USE 1.1.0 for v13**
- Module now compiles to ES2016

## 1.1.0
- Added the ability to mix custom questions with API ones
- Fixed empty field values bug when using custom questions
- Removed Node Canvas references

## 1.0.3
- Removed Canvas package to avoid installation errors

## 1.0.2 Patch
- Updated Discord.JS
- Updated open-trivia-db

## 1.0.1 Patch
✔️ Added support for Discord.JS 13.7.0

⚙️ Moved from Easy Trivia to [open-trivia-db](https://github.com/Elitezen/open-trivia-db-wrapper)

✔️ Custom Questions are now parsed and prepared under the hood when supplied.

🗒️ Updated README to reflect these changes.