import { MessageActionRow, MessageButton } from "discord.js";
import constants from "../../../constants";

const letters = ["🇦", "🇧", "🇨", "🇩"];
const joinButton = new MessageButton()
  .setCustomId(constants.libraryDefaults.defaultJoinButtonCustomId)
  .setLabel("Join")
  .setStyle("PRIMARY");
const a_Button = new MessageButton()
  .setCustomId("0")
  .setLabel(letters[0])
  .setStyle("PRIMARY");
const b_Button = new MessageButton()
  .setCustomId("1")
  .setLabel(letters[1])
  .setStyle("PRIMARY");
const c_Button = new MessageButton()
  .setCustomId("2")
  .setLabel(letters[2])
  .setStyle("PRIMARY");
const d_Button = new MessageButton()
  .setCustomId("3")
  .setLabel(letters[3])
  .setStyle("PRIMARY");
const multipleChoiceButtonRow = new MessageActionRow().addComponents([
  a_Button,
  b_Button,
  c_Button,
  d_Button,
]);
const false_Button = new MessageButton()
  .setCustomId("0")
  .setLabel("False")
  .setStyle("DANGER");
const true_Button = new MessageButton()
  .setCustomId("1")
  .setLabel("True")
  .setStyle("PRIMARY");
const booleanChoiceButtonRow = new MessageActionRow().addComponents([
  true_Button,
  false_Button,
]);

export {
  joinButton,
  a_Button,
  b_Button,
  c_Button,
  d_Button,
  multipleChoiceButtonRow,
  false_Button,
  true_Button,
  booleanChoiceButtonRow,
};
