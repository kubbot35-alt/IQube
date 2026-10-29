/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type DifficultyLevel = 1 | 2 | 3;

export type OptionId = 'A' | 'B' | 'C' | 'D';

export interface AnswerOption {
  id: OptionId;
  label: string;
  patternData?: Record<string, unknown>;
}

export interface Question {
  id: string;
  index: number;
  difficulty: DifficultyLevel;
  tBase: number; // in seconds (e.g. 20s for D=1, 40s for D=2, 70s for D=3)
  category: 'rotation' | 'progression' | 'boolean_logic' | 'spatial_relations' | 'symmetry' | 'matrix_arithmetic';
  ruleDescription: string;
  matrixData: unknown; // typed in graphics domain
  options: AnswerOption[];
  correctOptionId: OptionId;
}

export interface UserAnswer {
  questionId: string;
  questionIndex: number;
  selectedOptionId: OptionId;
  isCorrect: boolean;
  responseTimeSeconds: number;
  tBase: number;
  difficulty: DifficultyLevel;
  rawScore: number;
  speedBonus: number;
  timePenalty: number;
}

export interface DifficultyStats {
  correct: number;
  total: number;
  avgTime: number;
}

export interface IQScoreResult {
  iqScore: number; // 60 - 160
  rawScoreTotal: number;
  maxPossibleRaw: number;
  percentile: number; // 0.1 - 99.9%
  classification: string;
  accuracyPercentage: number;
  correctCount: number;
  totalQuestions: number;
  averageTimeSeconds: number;
  totalTimeSeconds: number;
  speedBonusAccumulated: number;
  timePenaltyDeducted: number;
  breakdownByDifficulty: {
    easy: DifficultyStats;
    medium: DifficultyStats;
    hard: DifficultyStats;
  };
  answers: UserAnswer[];
  completionTimestamp: number;
  testId: string;
}

export type QuizState = 'idle' | 'running' | 'completed';
