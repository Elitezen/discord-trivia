import { MessageButton, MessageButtonStyleResolvable } from "discord.js";
import { VerifyButtonOptions } from "../Typings/interfaces";

const defaults: VerifyButtonOptions = {
  disabled: false,
  noLink: true,
  style: "PRIMARY",
  customId: null
};

function verifyButton(button: MessageButton, options?: VerifyButtonOptions): MessageButton {
  
  if (options) {
    options = Object.assign(defaults, options);
  } else {
    options = defaults;
  }

  return button.setDisabled(options.disabled)
    .setStyle(button.style == "LINK" && options.noLink 
      ? "PRIMARY" 
      : options.style as MessageButtonStyleResolvable)
    .setCustomId(options.customId || button.customId || 'buttonId');
}

export default verifyButton;