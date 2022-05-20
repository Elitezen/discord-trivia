import { MessageActionRow, MessageButton } from "discord.js";

// The following errors occure without :any
// The inferred type of '...' cannot be named without a reference to 'discord.js/node_modules/discord-api-types/v9'. This is likely not portable. A type annotation is necessary.
const buttonRowChoicesMultiple:any = new MessageActionRow().addComponents([
  new MessageButton().setCustomId("0").setLabel("A").setStyle("PRIMARY"),
  new MessageButton().setCustomId("1").setLabel("B").setStyle("PRIMARY"),
  new MessageButton().setCustomId("2").setLabel("C").setStyle("PRIMARY"),
  new MessageButton().setCustomId("3").setLabel("D").setStyle("PRIMARY"),
]);

const buttonRowChoicesBoolean:any = new MessageActionRow().addComponents([
  new MessageButton().setCustomId("1").setLabel("True").setStyle("PRIMARY"),
  new MessageButton().setCustomId("0").setLabel("False").setStyle("DANGER"),
]);

const buttonRowQueue:any = new MessageActionRow().addComponents([
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
    .setLabel("True")
    .setStyle("PRIMARY")
    .setDisabled(true),
  new MessageButton()
    .setCustomId("0")
    .setLabel("False")
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

// The following error occures without :any
// The inferred type of 'Disabled' cannot be named without a reference to 'discord.js/node_modules/discord-api-types/v9'. This is likely not portable. A type annotation is necessary.
export const Disabled:any = {
  buttonRowChoicesMultipleDisabled,
  buttonRowChoicesBooleanDisabled,
  buttonRowQueueDisabled,
};
