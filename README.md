![Discord Trivia Logo](https://i.imgur.com/9gqrPGC.png)

# Discord Trivia 

A package that provides an easy way to create fully-fledged trivia games for Discord bots with Discord.JS. Includes support for +20 categories as well as customizable game settings, themes, and game messages. Comes with a built-in leaderboard system to track scores and rankings!

## Basic Example

```js
import { GameManager } from 'discord-trivia';

const manager = new GameManager();

// -- Inside your command function --
const game = manager.createGame(interaction.channel);

try {
    await game.startQueue(interaction);
} catch (err) {
    console.error(`An error occurred: ${err}`);
}
```

## Custom Questions

```js
const customQuestions = [
  new BooleanQuestion()
    .setValue("discord-trivia is awesome!")
    .setCategory("My epic category")
    .setDifficulty('easy') 
    .setCorrectAnswer('true'),
  new MultipleChoiceQuestion()
    .setValue("What's the best pizza topping?")
    .setCategory("food")
    .setDifficulty('medium')
    .setCorrectAnswer("Chicken feet")
    .setIncorrectAnswers(["Pepperoni", "Sausage", "Olives"])

  // Add more custom questions here...
];

game.config.customQuestions = customQuestions;

game.startQueue(interaction);
```

## Full Guide
[Click here to view the full guide](https://elitezen.github.io/discord-trivia-website/)