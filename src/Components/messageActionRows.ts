import { MessageActionRow, MessageButton } from "discord.js";

const buttonRowChoicesMultiple = new MessageActionRow().addComponents([
  new MessageButton().setCustomId("0").setLabel("A").setStyle("PRIMARY"),
  new MessageButton().setCustomId("1").setLabel("B").setStyle("PRIMARY"),
  new MessageButton().setCustomId("2").setLabel("C").setStyle("PRIMARY"),
  new MessageButton().setCustomId("3").setLabel("D").setStyle("PRIMARY"),
]);

const buttonRowChoicesBoolean = new MessageActionRow().addComponents([
  new MessageButton().setCustomId("1").setLabel("TRUE").setStyle("PRIMARY"),
  new MessageButton().setCustomId("0").setLabel("FALSE").setStyle("DANGER"),
]);

const buttonRowQueue = new MessageActionRow().addComponents([
  new MessageButton().setCustomId("1").setLabel("Join").setStyle("SUCCESS"),
]);

const buttonRowChoicesMultipleDisabled = new MessageActionRow().addComponents([
  new MessageButton()
    .setCustomId("0")
    .setLabel("A")
    .setStyle("PRIMARY")
    .setDisabled(true),
  new MessageButton()
    .setCustomId("1")
    .setLabel("B")
    .setStyle("PRIMARY")
    .setDisabled(true),
  new MessageButton()
    .setCustomId("2")
    .setLabel("C")
    .setStyle("PRIMARY")
    .setDisabled(true),
  new MessageButton()
    .setCustomId("3")
    .setLabel("D")
    .setStyle("PRIMARY")
    .setDisabled(true),
]);

const buttonRowChoicesBooleanDisabled = new MessageActionRow().addComponents([
  new MessageButton()
    .setCustomId("1")
    .setLabel("TRUE")
    .setStyle("PRIMARY")
    .setDisabled(true),
  new MessageButton()
    .setCustomId("0")
    .setLabel("FALSE")
    .setStyle("DANGER")
    .setDisabled(true),
]);

const buttonRowQueueDisabled = new MessageActionRow().addComponents([
  new MessageButton()
    .setCustomId("1")
    .setLabel("Join")
    .setStyle("SUCCESS")
    .setDisabled(true),
]);

export { buttonRowChoicesMultiple, buttonRowChoicesBoolean, buttonRowQueue };
export const Disabled = {
  buttonRowChoicesMultipleDisabled,
  buttonRowChoicesBooleanDisabled,
  buttonRowQueueDisabled,
};
