# CHANGELOG

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