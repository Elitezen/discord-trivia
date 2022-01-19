import { MessageButton, MessageButtonStyle, MessageButtonStyleResolvable } from "discord.js";
import { MessageButtonStyles } from "discord.js/typings/enums";

const joinButton = new MessageButton()
  .setCustomId('join_game_discordtrivia')
  .setLabel('Join')
  .setStyle('PRIMARY');

interface VerifyButtonOptions {
  disabled?: Boolean;
  style?: MessageButtonStyle;
  noLink?: Boolean;
  customId?: string | null;
}

const defaults: VerifyButtonOptions = {
  disabled: false,
  noLink: true,
  style: "PRIMARY",
  customId: null
}

function verifyButton(button: MessageButton, options?: VerifyButtonOptions): MessageButton {
  if (options) {
    options = Object.assign(defaults, options);
  } else {
    options = defaults;
  }

  //@ts-expect-error
  return button.setDisabled(options.disabled)
  //@ts-expect-error
    .setStyle(options.style)
    //@ts-expect-error
    .setStyle(button.style == "LINK" && options.noLink ? "PRIMARY" : options.style)
    //@ts-expect-error
    .setCustomId(options.customId | "idek_button")
}

export {
  joinButton,
  verifyButton
}