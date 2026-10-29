/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DifficultyLevel, IQScoreResult, Question, UserAnswer } from '../models/types';

export interface QuestionScoreDetail {
  score: number;
  speedBonus: number;
  penalty: number;
}

export interface IIQCalculator {
  calculateQuestionScore(
    difficulty: DifficultyLevel,
    tBase: number,
    timeSpent: number,
    isCorrect: boolean
  ): QuestionScoreDetail;

  calculateScore(
    answers: UserAnswer[],
    questions: Question[]
  ): IQScoreResult;
}
