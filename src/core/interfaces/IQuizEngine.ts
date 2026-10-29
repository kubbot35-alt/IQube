/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IQScoreResult, OptionId, Question, QuizState, UserAnswer } from '../models/types';

export interface QuizProgress {
  currentIndex: number;
  totalQuestions: number;
  currentQuestion: Question | null;
  answeredCount: number;
  elapsedTotalSeconds: number;
  currentQuestionElapsedSeconds: number;
  state: QuizState;
}

export type QuizEngineListener = (progress: QuizProgress) => void;

export interface IQuizEngine {
  getState(): QuizState;
  getProgress(): QuizProgress;
  getCurrentQuestion(): Question | null;
  getQuestions(): Question[];
  start(): void;
  submitAnswer(selectedOptionId: OptionId, responseTimeSeconds: number): UserAnswer;
  finish(): IQScoreResult;
  getResult(): IQScoreResult | null;
  reset(): void;
  subscribe(listener: QuizEngineListener): () => void;
}
