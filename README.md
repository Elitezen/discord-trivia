![Banner](images/banner_transparent.png)

# Discord Trivia

Create fully-fledge trivia games with DiscordJS!

**Discord.js v14**

```bash
npm install discord-trivia
# or using yarn
yarn add discord-trivia
```

**Discord.js v13**

Visit [here](https://github.com/Elitezen/discord-trivia/tree/aeed2957b0a8adb9488ba7f3eb6a2ac17d83ab8a) for a guide in v13.

```bash
npm install discord-trivia@1.1.0
# or using yarn
yarn add discord-trivia@1.1.0
```

## Example Code for Slash Commands

```js
const { SlashCommandBuilder, Colors, ButtonStyle } = require("discord.js");
const { TriviaManager } = require("discord-trivia");

const trivia = new TriviaManager();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('trivia')
    .setDescription('Test out trivia'),
  async execute(interaction) {
    const game = trivia.createGame(interaction)
      .decorate({
        embedColor: Colors.Green,
        buttonStyle: ButtonStyle.Primary
      })
      .setQuestionOptions({
        amount: 15,
        category: 'Animals',
        difficulty: 'hard',
      })
      .setGameOptions({
        showAnswers: true,
        timePerQuestion: 15_000,
        maxPoints: 100
      });


    game.setup()
      .catch(console.error);
  }
}
```

## Example for Messages

```js
client.on('messageCreate', message => {
  if (message.author.bot) return;

  const game = trivia.createGame(message)
    .decorate({
      embedColor: Colors.Green,
      buttonStyle: ButtonStyle.Primary
    })
    .setQuestionOptions({
      amount: 15,
      category: 'Animals',
      difficulty: 'hard',
    })
    .setGameOptions({
      showAnswers: true,
      timePerQuestion: 15_000,
      maxPoints: 100
    });

  game.setup()
    .catch(console.error);
});
```

## Usage

Discord Trivia is highly customizable. Change the color of your embeds, styles of the buttons, and game settings.

### ✨ Decorate Your Game and Make it Feel Unique!

```js
game.decorate({
    embedColor: Colors.Purple,
    buttonStyle: ButtonStyle.Danger,
    embedImage: 'https://link-to-cool-background/',
    embedThumbnail: 'https://link-to-epic-icon/'
  })
```

### ✏️ Customize The Libraries Outputs

```js
game.setGameTexts({
  alreadyQueued: (user) => `❗ You are already in the queue, ${user.username}`,
  preparingQuestion: () => "🕥 Preparing the next question...",
  notInMatch: () => "❌ You are not apart of this match",
  alreadyChoseAnswer: (user) => `You already chose an answer ${user.username}!`,
  gameFailedRequirements: () => "Game failed to meet minimum player requirements",
  answerLockedInPrivate: (user, timeElapsed) => `You locked in at ${timeElapsed / 1000} seconds`,
  answerLockedInPublic: (player:Player) => `**${player.member.displayName}** has locked in!`,
  memberJoinedGame: (member:GuildMember) => `🙌   Welcome aboard ${member.displayName}!`
});
```

### ⚙️ Control Your Game With Extensive Configuration.

```js
game.setGameOptions({
    queueTime: 30_000,
    minPlayerCount: 3,
    maxPlayerCount: 20,
    minPoints: 10,
    maxPoints: 100,
    timeBetweenRounds: 5_000,
    timePerQuestion: 15_000,
    streakDefinitionLevel: 3,
    pointsPerSteakAmount: 30,
    maximumStreakBonus: 300,
    showAnswers: true
  });
```

### ❓Choose The Best Questions for You and Your Friends.

```js
game.setGameOptions({
    amount: 15,
    category: 'History',
    difficulty:'medium',
    type: 'multiple'
  });
```

### ✏️ Create Your Own Questions For The Game!

```js
const myQuestions = [
  {
    value: 'What is the best pizza topping?',
    category: 'General Knowledge',
    difficulty: 'easy',
    type: 'multiple',
    correctAnswer: 'Chicken Feet',
    incorrectAnswers: ['Pepperoni', 'Sausage', 'Cheese']
  },
  ...
];

game.setGameQuestions({
  customQuestions: myQuestions
});
```

### 🔔 Listen for Game Events.

```js
game.on('pending', () => { ... });
game.on('queue', () => { ... });
game.on('memberJoin', member => { ... });
game.on('end', finalData => { ... });

game.setup()
  .catch(console.error);
```

🔺 Make sure to assign event listeners *before* `game.setup()`

## Consider Using `open-trivia-db`

Discord Trivia uses [open-trivia-db](https://www.npmjs.com/package/open-trivia-db) to retrieve trivia questions. Some category names are long! Use the `CategoryNames` enum from `open-trivia-db` to easily access categories.

This is not required since Discord Trivia is typed, but can come handy when abstracting the library.

**Install The Addon**

```ssh
npm i open-trivia-db
```

**Example Usage**
```js
const { CategoryNames } = require('open-trivia-db');

game.setGameQuestions({
  category: CategoryNames.Geography
});
```

▶️ `open-trivia-db` Includes a lot of utility for trivia question fetching. Visit the [NPM page](https://www.npmjs.com/package/open-trivia-db) to learn more.