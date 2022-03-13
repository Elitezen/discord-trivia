import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import {
  TriviaCommandBuilderConfigEntry,
  TriviaCommandBuilderOptions,
  TriviaCommandBuilderOptionsStrict,
  TriviaGameOptions,
} from "../Typings/interfaces";
import {
  TriviaCommandBuilderConfig,
  TriviaCommandBuilderType,
  TriviaGameOptionKeys,
} from "../Typings/types";
import TriviaGame from "./TriviaGame";

export default class TriviaCommandBuilder {
  public build: SlashCommandBuilder;
  public lockedOptions!: TriviaCommandBuilderConfig;
  public readonly type!: TriviaCommandBuilderType;
  public readonly options: TriviaCommandBuilderOptionsStrict;
  public gameOptions!: TriviaGameOptions;
  public static readonly defaults: TriviaCommandBuilderOptionsStrict = {
    name: "trivia",
    description: "Start a trivia game!",
    type: "BUILDER",
  };

  constructor(options: TriviaCommandBuilderOptions) {
    this.options = Object.assign(TriviaCommandBuilder.defaults, options);
    this.build = new SlashCommandBuilder()
      .setName(this.options.name)
      .setDescription(this.options.description);
  }

  public lockGameOption({
    optionName: option,
    value,
  }: TriviaCommandBuilderConfigEntry) {
    this.lockedOptions.push({
      optionName: option,
      value: value,
    });

    return this;
  }

  private createBuilderOptions() {
    const thisClass = this;
    function isLocked(str: TriviaGameOptionKeys) {
      return thisClass.lockedOptions.some((e) => e.optionName == str);
    }

    if (!isLocked("maximumPlayerCount")) {
      this.build.addIntegerOption((opt) =>
        opt
          .setName("Maximum Player Count")
          .setDescription(
            "The maximum number of players allowed to join this game"
          )
          .setRequired(false)
      );
    }
  }

  public lockGameOptions() {
    const obj: TriviaGameOptions = {};
    this.lockedOptions.forEach((entry) => {
      Object.defineProperty(obj, entry.optionName, {
        value: entry.value,
        writable: false,
      });
    });

    return obj;
  }

  public toBuilderData() {
    this.createBuilderOptions();
    return this.build;
  }

  public toJSON() {
    this.createBuilderOptions();
    return this.build.toJSON();
  }
}

// const triviaCommand = new TriviaCommandBuilder({
//   type: 'JSON',
//   name: 'd',
//   description: ''
// }).lockGameOption({
//   option: 'maximumPlayerCount',
//   value: 10
// }).toBuilderData();
