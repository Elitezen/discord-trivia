const constants = {
  libraryDefaults: {
    defaultJoinButtonCustomId: 'discord_trivia_join_button',
    defaultStartButtonCustomId: 'discord_trivia_start_button',
  },
  embeds: {
    author: {
        name: "Powered by Discord Trivia",
        iconURL:
          "https://media.discordapp.net/attachments/933214093450555463/933550211517808721/trivia_2.png",
        url: "https://github.com/Elitezen/discord-trivia",
    },
    interactWithButtons: {
        text: "Use the buttons below to interact",
        iconURL:
          "https://cdn.discordapp.com/emojis/935296239858241577.png?size=96&quality=lossless",
    },
    emojis: (key: string) => {
      const emojiMap: {
        [key:string]: string
      } = {
        'A': '🇦', 
        'B': '🇧', 
        'C': '🇨', 
        'D': '🇩',
        '0': '0️⃣', 
        '1': '1️⃣',
        '2': '2️⃣', 
        '3': '3️⃣', 
        '4': '4️⃣', 
        '5': '5️⃣',
        '6': '6️⃣', 
        '7': '7️⃣', 
        '8': '8️⃣', 
        '9': '9️⃣',
        '10': '🔟',
        'GOLD': '🥇',
        'SILVER': '🥈',
        'BRONZE': '🥉'
      };

      return emojiMap[key] || null;
    }
}
};

export default constants;