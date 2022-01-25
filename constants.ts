const {
  urls,
  icon
} = {
  urls: {
    npm: null,
    github: "https://github.com/Elitezen/discord-trivia"
  },
  icon: "https://media.discordapp.net/attachments/933214093450555463/933550211517808721/trivia_2.png?width=609&height=609",
}

const constants = {
  libraryDefaults: {
    defaultJoinButtonCustomId: 'discord_trivia_join_button',
    defaultStartButtonCustomId: 'discord_trivia_start_button',
    author: {
      name: "Powered By discord-trivia",
      iconURL: icon,
      url: urls.npm || urls.github,
    }
  },
  icon,
  urls
};

export default constants;