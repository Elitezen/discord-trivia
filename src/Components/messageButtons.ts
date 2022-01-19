import { MessageButton } from "discord.js";

const joinButton = new MessageButton()
  .setCustomId('join')
  .setLabel('Join')
  .setStyle('PRIMARY');
const joinButtonDisabled = new MessageButton()
  .setCustomId('0')
  .setLabel('FULL')
  .setStyle('PRIMARY');

export {
  joinButton,
  joinButtonDisabled
}