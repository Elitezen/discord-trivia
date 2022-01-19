import { MessageEmbed, User } from "discord.js";

interface ReplaceOptionsOptions {
    user: User;
}

export default function ReplaceOptions(text: string | null, options: ReplaceOptionsOptions): string {
    if(!text) throw TypeError("text cannot be null")

    return text.replace("{{player}}", options.user.username).replace("{{playerName}}", options.user.username).replace("{{playerMention}}", options.user.toString());
}

export function ReplaceOptionsEmbed(embed: MessageEmbed, options: ReplaceOptionsOptions): MessageEmbed {
    embed.setDescription(ReplaceOptions(embed.description, options))
    .setTitle(ReplaceOptions(embed.title, options))
    //Add replace for fields, author, and footer
    return embed;
}