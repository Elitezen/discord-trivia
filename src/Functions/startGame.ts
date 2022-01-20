import { Guild, TextBasedChannel } from "discord.js";
import { Categories, getQuestions, TriviaCategoryName, TriviaCategoryResolvable, TriviaSession } from "easy-trivia";
import TriviaGame from "../Classes/TriviaGame";

export const getQuestionsByIdAndName = (nameOrId: TriviaCategoryName | number | any): TriviaCategoryResolvable => {
    const ID = Categories.categoryById(nameOrId);
    const Name = Categories.categoryByName(nameOrId);
    //@ts-expect-error
    return ID == null ? Name : ID;
}

export default async function(game: TriviaGame, guild: Guild, channel: TextBasedChannel) {
    const session = new TriviaSession();
    const sToken = await session.start();

    //@ts-expect-error
    for (let i = 0; i > game.options.questionAmount; i++) {
        const q = await getQuestions({
            //@ts-expect-error
            amount: game.options.questionAmount,
            category: getQuestionsByIdAndName(game.options.triviaCategory),
            //@ts-expect-error
            difficulty: game.options.questionDifficulty,
            //@ts-expect-error
            token: sToken
        });

        
    }
}