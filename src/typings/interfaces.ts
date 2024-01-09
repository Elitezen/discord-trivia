import type { ButtonBuilder, EmbedBuilder, User } from 'discord.js';
import { MessageDeleterConfig } from './types';
import Player from '../classes/Player';
import { BooleanString, CategoryNameType, IncorrectAnswers, QuestionDifficulties, QuestionDifficultyType, QuestionTypeType, QuestionTypes } from 'open-trivia-db';

export interface GameConfig {
    buttons: {
        join: ButtonBuilder;
        questionOptionA: ButtonBuilder;
        questionOptionB: ButtonBuilder;
        questionOptionC: ButtonBuilder;
        questionOptionD: ButtonBuilder;
        questionOptionTrue: ButtonBuilder;
        questionOptionFalse: ButtonBuilder;
    },

    embeds: {
        queue: (players?:Player[]) => EmbedBuilder;
        gameStart: () => EmbedBuilder;
        playerJoin: (player: Player) => EmbedBuilder;
        gameQueueTimeout: () => EmbedBuilder;
        question: (question:GameQuestion) => EmbedBuilder;
        leaderboardUpdate: (leaderboard:any) => EmbedBuilder;

        playerNotInMatch: (user:User) => EmbedBuilder;
        playerAlreadyAnswered: (player:Player) => EmbedBuilder;
        playerAnsweredStats: (player:Player, timeElapsed:number) => EmbedBuilder;
        playerAlreadyQueued: (player:Player) => EmbedBuilder;

        filterReject: (user:User) => EmbedBuilder;
        gameEnd: (leaderboard:any) => EmbedBuilder;
    },

    fetchQuestionsOptions: GameQuestionOptions;

    customQuestions: any[];

    showAnswers: boolean;

    messageDeleter: GameMessageData;

    playerFilter: ((user: User) => boolean | Promise<boolean>) | null;

    queueDuration: number;

    timeBetweenRounds: number;

    timeBetweenQuestions: number;

    timePerQuestion: number;

    minPoints: number;

    minPlayerCount: number;
    
    maxPlayerCount: number;
    
    maxPoints: number;

    streakDefinitionLevel: number,

    pointsPerStreakAmount: number,

    maximumStreakBonus: number
}

export interface GameQuestionOptions extends Record<string, any> {
    /**
     * The amount of API questions to fetch.
     */
    amount: number;
  
    /**
     * The category of questions to fetch.
     */
    category?: CategoryNameType | number;
  
    /**
     * The difficulty of questions to fetch.
     */
    difficulty?: QuestionDifficultyType | QuestionDifficulties;
  
    /**
     * The type of questions to fetch.
     */
    type?: QuestionTypeType;
}

export interface GameMessageData {
    queue: MessageDeleterConfig;
    gameStart: MessageDeleterConfig;
    question: MessageDeleterConfig;
    leaderboardUpdate: MessageDeleterConfig;
}

/**
 * The options for a game's question configuration.
 */
export interface GameQuestionOptions {
    /**
     * The amount of API questions to fetch.
     */
    amount: number;
  
    /**
     * The category of questions to fetch.
     */
    category?: CategoryNameType | number;
  
    /**
     * The difficulty of questions to fetch.
     */
    difficulty?: QuestionDifficultyType | QuestionDifficulties;
  
    /**
     * The type of questions to fetch.
     */
    type?: QuestionTypeType;
}

/**
 * Represents a trivia question.
 */
export interface GameQuestion {
    /**
     * The question itself.
     */
    value: string;
  
    /**
     * This question's category.
     */
    category: string;
  
    /**
     * This question's difficulty level.
     */
    difficulty: QuestionDifficultyType;
  
    /**
     * This question's type.
     */
    type: QuestionTypes;
  
    /**
     * This question's correct answer
     */
    correctAnswer: string;
  
    /**
     * This question's incorrect answer(s)
     */
    incorrectAnswers: IncorrectAnswers | BooleanString;
  
    /**
     * All answer choices
     */
    allAnswers: string[];
  
    /**
     * Checks if the given string equals this question's correct answer.
     * @param {string} str
     * @returns {boolean}
     */
    checkAnswer: (str: string) => boolean;
  }