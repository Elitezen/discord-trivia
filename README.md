![Banner](Images/banner.svg)

# Discord Trivia
### **⚠️ This project is in beta ⚠️**
Discord Trivia is a NodeJS library which builds on top of [Easy Trivia](https://github.com/Elitezen/easy-trivia) and [Discord.JS](https://github.com/discordjs/discord.js/) to easily integrate trivia matches with your Discord client.

## Newest Additions
* 🔥 Added Customizable Streaks!
* 👂 `TriviaGame` now extends `EventEmitter` and has 5 events, [View Here](#events)
* 🔎 Added minimal JSDoc typings to some methods.
* 🐞 Bug Fixes, including one where True/False questions would not emit the correct answer when answer checking.
* ✨ Polishes to what Discord users see 
* 🗒️ README Draft Written

## Installation
Requires Node v16+ and Discord.JS 13.6.0 or higher
```
npm i discord-trivia
```

## Example Usage
```js
const { SlashCommandBuilder } = require('@discordjs/builders');

const { TriviaManager } = require('discord-trivia');
const trivia = new TriviaManager();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('trivia')
		.setDescription('Starts a trivia match!'),
	async execute(interaction) {
		const game = trivia.createGame(interaction);
    await game.start();
	},
};
```
# Customizable
Discord Trivia Gives you the power to customize your matches as you wish.

### Questions
Discord Trivia games are powered by [Easy Trivia](https://github.com/Elitezen/easy-trivia), which is powered by the [Open Trivia Database](https://opentdb.com/) API. You can declare the exact type of questions you wish to be part of a match via [TriviaGameOptions](documentation#interfaces-triviagameoptions)

```js
const game = trivia.createGame(interaction, {
    timePerQuestion: 15_000,
    triviaCategory: 'history',
    questionAmount: 10,
    questionDifficulty: 'hard',
    questionType: 'multiple',
});
```

**Tip**: Install Easy Trivia to your project to recieve tools for OpenTDB, including intellisense on longer OpenTDB category names.

```
npm i easy-trivia
```

```js
import { CategoryNamesStrict } from "easy-trivia";

const game = trivia.createGame(interaction, {
    triviaCategory: CategoryNamesStrict.ENTERTAINMENT_MUSICALS_AND_THEATRES
});
```

🚨 **Keep in mind**: Easy Trivia only works with ESM import/export syntax.

### Game Configuration
Customize lobby restrictions, how your fast game flows and handles awarding points.

```js
const game = trivia.createGame(interaction, {
    minimumPlayerCount: 5,
    maximumPlayerCount: 20,

    queueTime: 20_000,
    timePerQuestion: 15_000,
    timeBetweenRounds: 10_000,

    minimumPoints: 10,
    maximumPoints: 100,
    pointsPerStreakAmount: 20,
    maximumStreakBonus: 100,
    streakDefinitionLevel: 3
});
```

### Theme
Edit the color of the embeds via [TriviaManagerOptions](documentation#interfaces-triviamanageroptions)

```js
const redTrivia = new TriviaManager({
  theme: 'RED'
});

const blueTrivia = new TriviaManager({
  theme: '#0000FF'
});

const randomColorTrivia = new TriviaManager({
  theme: 'RANDOM'
});
```

### Events
Execute code when something happens in your match or the state of your match changes.

```js
game.on('pending', () => {
    // Code
});

game.on('queue', () => {
    // Code
});

game.on('playerJoinQueue', player => {
    // Code
});

game.on('inProgress', () => {
    // Code
});

game.on('ended', data => {
    // Code
}); 

await game.start();
```

🚨 **Keep in mind**: Your listeners must be assigned **before** starting a game, otherwise they may not be registered in time.

# Documentation (Draft)

## Interfaces

## `TriviaGameData`
The data a game holds.

Includes: [GuildMember](https://discord.js.org/#/docs/main/stable/class/GuildMember), [Collection](https://discord.js.org/#/docs/collection/main/class/Collection), [Snowflake](https://discord.com/developers/docs/reference#snowflakes), [TriviaPlayer](#triviaplayer)
```ts
interface TriviaGameData {
  hostMember: GuildMember;
  players: Collection<Snowflake, TriviaPlayer>;
}
```

## `ResultPlayerData`
An entry of player data once the match ends.

Includes: [Snowflake](https://discord.com/developers/docs/reference#snowflakes)
```ts
interface ResultPlayerData {
  id: Snowflake;
  points: number;
}
```

## `TriviaGameResultData`
The data of a game once the match ends.

Includes: [Snowflake](https://discord.com/developers/docs/reference#snowflakes), [ResultPlayerData](#resultplayerdata)
```ts
interface TriviaGameResultData {
  hostMemberId: Snowflake;
  players: ResultPlayerData[];
}
```

## `TriviaGameOptions`
The configuration for a game.

Includes: [CategoryResolvable](https://github.com/Elitezen/easy-trivia/wiki/Documentation#CategoryResolvable), [QuestionDifficulty](https://github.com/Elitezen/easy-trivia/wiki/Documentation#QuestionDifficulty), [QuestionType](https://github.com/Elitezen/easy-trivia/wiki/Documentation#questiontype)
```ts
interface TriviaGameOptions {
  minimumPlayerCount: number;
  maximumPlayerCount: number;
  timePerQuestion: number;
  triviaCategory: CategoryResolvable | null;
  questionAmount: number;
  questionDifficulty: QuestionDifficulty | null;
  questionType: QuestionType | null;
  queueTime: number;
  minimumPoints: number;
  maximumPoints: number;
  timeBetweenRounds: number
}
```

### `TriviaManagerOptions`
A manager's configuration

Includes: [ColorResolvable](https://discord.js.org/#/docs/main/stable/typedef/ColorResolvable)

*theme: The color to set for embeds.*
```ts
interface TriviaManagerOptions {
  theme?: ColorResolvable;
  showAnswers?: boolean;
}
```

## `TriviaPlayer`
A player of a game

Extends: [GuildMember](https://discord.js.org/#/docs/main/stable/class/GuildMember)
```ts
interface TriviaPlayer extends GuildMember {
  points: number;
  hasAnswered: boolean;
  isCorrect: boolean;
  correctAnswerStreak: number;
}
```
# Bug Reporting
[View the bug report template](https://github.com/Elitezen/discord-trivia/blob/main/.github/ISSUE_TEMPLATE/bug-report.md)

# Contributing
[Read here for contributing](https://github.com/Elitezen/discord-trivia/blob/main/CONTRIBUTING.md)

# Support Server
Click to join:

[![](http://invidget.switchblade.xyz/wtwM4HhbAr)](https://discord.gg/wtwM4HhbAr)