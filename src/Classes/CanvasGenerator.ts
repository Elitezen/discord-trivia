import TriviaGame from "./TriviaGame";
import { createCanvas } from "canvas";
import { CanvasGeneratorOptions } from "../Typings/interfaces";

/**
 * Unused, TDB
 */
export default class CanvasGenerator {
  public readonly canvas = createCanvas(
    CanvasGenerator.dimensions.width,
    CanvasGenerator.dimensions.height
  );
  public readonly game: TriviaGame;
  public readonly context = this.canvas.getContext("2d");
  public readonly options: CanvasGeneratorOptions;
  public static readonly canvasPadding = 100;
  public static readonly dimensions = {
    width: 1080,
    height: 720,
  };

  private libraryDefaults = {
    backgroundColor: "#41e838",
  };

  public static readonly defaults: CanvasGeneratorOptions = {
    font: "1em Helvetica, sans-serif",
  };

  constructor(game: TriviaGame, options?: CanvasGeneratorOptions) {
    this.options = options
      ? Object.assign(CanvasGenerator.defaults, options)
      : CanvasGenerator.defaults;
    this.game = game;
    this.context.fillStyle = this.libraryDefaults.backgroundColor;
    this.context.fillRect(
      0,
      0,
      CanvasGenerator.dimensions.width,
      CanvasGenerator.dimensions.height
    );
  }

  private setTitle(
    title: string,
    alignment: "left" | "center" | "right" = "center"
  ) {
    this.context.textAlign = alignment;
    this.context.fillStyle = "white";
    this.context.font = `90px ${CanvasGenerator.defaults.font}`;

    const textWidth = this.context.measureText(title).width;
    const center = CanvasGenerator.dimensions.width / 2 - textWidth / 2;

    this.context.fillText(title, center, CanvasGenerator.canvasPadding);
  }

  applyText(text: string) {
    // https://discordjs.guide/popular-topics/canvas.html#adding-in-text

    const context = this.canvas.getContext("2d");

    // Declare a base size of the font
    let fontSize = 70;

    do {
      // Assign the font to the context and decrement it so it can be measured again
      context.font = `${(fontSize -= 10)}px ${CanvasGenerator.defaults.font}`;
      // Compare pixel width of the text to the canvas minus the approximate avatar size
    } while (context.measureText(text).width > this.canvas.width - 300);

    // Return the result to use in the actual canvas
    return context.font;
  }

  getLines(text: string) {
    // https://stackoverflow.com/a/16599668/12464931

    const words = text.split(" ");
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = this.context.measureText(currentLine + " " + word).width;
      if (width < CanvasGenerator.dimensions.width) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }

    lines.push(currentLine);
    return lines;
  }
}
