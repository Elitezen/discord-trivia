![Banner](Images/banner.svg)

# Discord Trivia
### **⚠️ This project is under construction ⚠️**
Discord Trivia is a TypeScript library which builds on top of [Easy Trivia](https://github.com/Elitezen/easy-trivia) and [Discord.JS](https://github.com/discordjs/discord.js/) to easily integrate trivia matches via your Discord client. 

Testing Phase

1️⃣ Step 1:

Clone discord-trivia from github
```shell
git clone https://github.com/Elitezen/discord-trivia.git
```


2️⃣ Step 2:

Integrate the following into your trivia command file:
```js
// Namespace
const { TriviaManager } = require("../../discord-trivia");

// Command function
const trivia = new TriviaManager();
const game = trivia.createGame(interaction);

try {
    await game.start();
} catch (err) {
    console.error(err);
}
```

# Contributing
[Read here for contributing](https://github.com/Elitezen/discord-trivia/blob/main/CONTRIBUTING.md)

# Docs
TBD

# Support Server
[![](http://invidget.switchblade.xyz/wtwM4HhbAr)](https://discord.gg/wtwM4HhbAr)
