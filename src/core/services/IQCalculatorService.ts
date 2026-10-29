/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IIQCalculator, QuestionScoreDetail } from '../interfaces/IIQCalculator';
import { DifficultyLevel, DifficultyStats, IQScoreResult, Question, UserAnswer } from '../models/types';

export class IQCalculatorService implements IIQCalculator {
  // Psychometric calibration parameters
  private readonly lambda: number = 0.25; // max speed bonus +25%
  private readonly beta: number = 0.50;   // time degradation factor
  private readonly delta: number = 0.30;  // score floor factor for correct slow answers

  /**
   * Calculates score for a single question based on correctness, difficulty, and reaction time.
   */
  public calculateQuestionScore(
    difficulty: DifficultyLevel,
    tBase: number,
    timeSpent: number,
    isCorrect: boolean
  ): QuestionScoreDetail {
    if (!isCorrect) {
      return { score: 0, speedBonus: 0, penalty: 0 };
    }

    const t = Math.max(0.1, timeSpent);
    const baseDifficultyScore = difficulty;

    if (t <= tBase) {
      // Speed bonus: Di * (1 + lambda * (tBase - t) / tBase)
      const bonusFactor = this.lambda * ((tBase - t) / tBase);
      const speedBonus = baseDifficultyScore * bonusFactor;
      const score = baseDifficultyScore + speedBonus;
      return { score, speedBonus, penalty: 0 };
    } else {
      // Overtime penalty with delta floor: Di * max(delta, 1 - beta * (t - tBase) / tBase)
      const ratio = (t - tBase) / tBase;
      const degradedMultiplier = Math.max(this.delta, 1 - this.beta * ratio);
      const score = baseDifficultyScore * degradedMultiplier;
      const penalty = baseDifficultyScore - score;
      return { score, speedBonus: 0, penalty };
    }
  }

  /**
   * Calculates aggregate psychometric result normalized to Gaussian IQ scale (mu=100, sigma=15).
   */
  public calculateScore(answers: UserAnswer[], questions: Question[]): IQScoreResult {
    const totalQuestions = questions.length;
    let rawScoreTotal = 0;
    let correctCount = 0;
    let totalTimeSeconds = 0;
    let speedBonusAccumulated = 0;
    let timePenaltyDeducted = 0;

    // Nominal maximum difficulty points
    let nominalTotalDifficulty = 0;
    questions.forEach((q) => {
      nominalTotalDifficulty += q.difficulty;
    });

    const maxPossibleRaw = nominalTotalDifficulty * (1 + this.lambda);

    const breakdown: {
      easy: DifficultyStats;
      medium: DifficultyStats;
      hard: DifficultyStats;
    } = {
      easy: { correct: 0, total: 0, avgTime: 0 },
      medium: { correct: 0, total: 0, avgTime: 0 },
      hard: { correct: 0, total: 0, avgTime: 0 },
    };

    const timesByDifficulty: { easy: number[]; medium: number[]; hard: number[] } = {
      easy: [],
      medium: [],
      hard: [],
    };

    answers.forEach((ans) => {
      rawScoreTotal += ans.rawScore;
      totalTimeSeconds += ans.responseTimeSeconds;
      speedBonusAccumulated += ans.speedBonus;
      timePenaltyDeducted += ans.timePenalty;

      const diffKey: 'easy' | 'medium' | 'hard' =
        ans.difficulty === 1 ? 'easy' : ans.difficulty === 2 ? 'medium' : 'hard';

      breakdown[diffKey].total += 1;
      timesByDifficulty[diffKey].push(ans.responseTimeSeconds);
      if (ans.isCorrect) {
        correctCount += 1;
        breakdown[diffKey].correct += 1;
      }
    });

    // Compute average times per difficulty
    (['easy', 'medium', 'hard'] as const).forEach((key) => {
      const times = timesByDifficulty[key];
      breakdown[key].avgTime = times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
    });

    const averageTimeSeconds = answers.length > 0 ? totalTimeSeconds / answers.length : 0;
    const accuracyPercentage = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;

    // Population norms calibrated for standard Raven progressive matrix tests
    // muExpected: expected raw score for median population (approx 48% of nominal difficulty)
    // sigmaExpected: standard deviation of raw scores across general population
    const muExpected = nominalTotalDifficulty * 0.48;
    const sigmaExpected = nominalTotalDifficulty * 0.22;

    const zScore = sigmaExpected > 0 ? (rawScoreTotal - muExpected) / sigmaExpected : 0;
    const rawIq = 100 + 15 * zScore;
    const iqScore = Math.round(Math.min(160, Math.max(60, rawIq)));

    const percentile = this.calculatePercentile(iqScore);
    const classification = this.getClassification(iqScore);

    return {
      iqScore,
      rawScoreTotal: Number(rawScoreTotal.toFixed(2)),
      maxPossibleRaw: Number(maxPossibleRaw.toFixed(2)),
      percentile: Number(percentile.toFixed(1)),
      classification,
      accuracyPercentage: Number(accuracyPercentage.toFixed(1)),
      correctCount,
      totalQuestions,
      averageTimeSeconds: Number(averageTimeSeconds.toFixed(1)),
      totalTimeSeconds: Number(totalTimeSeconds.toFixed(1)),
      speedBonusAccumulated: Number(speedBonusAccumulated.toFixed(2)),
      timePenaltyDeducted: Number(timePenaltyDeducted.toFixed(2)),
      breakdownByDifficulty: breakdown,
      answers,
      completionTimestamp: Date.now(),
      testId: 'CTX-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
    };
  }

  /**
   * Computes the percentile using standard error function (erf) approximation.
   */
  private calculatePercentile(iq: number): number {
    const z = (iq - 100) / 15;
    const p = 0.5 * (1 + this.approxErf(z / Math.SQRT2));
    const clamped = Math.min(99.9, Math.max(0.1, p * 100));
    return clamped;
  }

  /**
   * Abramowitz and Stegun error function approximation (|error| < 1.5e-7).
   */
  private approxErf(x: number): number {
    const sign = x >= 0 ? 1 : -1;
    const a = Math.abs(x);

    // Coefficients
    const p = 0.3275911;
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;

    const t = 1.0 / (1.0 + p * a);
    const y = 1.0 - (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) * Math.exp(-a * a);

    return sign * y;
  }

  /**
   * Wechsler psychometric intelligence classification.
   */
  private getClassification(iq: number): string {
    if (iq >= 145) return 'Geniusz / Wybitny umysł (Genius)';
    if (iq >= 130) return 'Bardzo wysoki (Very Superior)';
    if (iq >= 120) return 'Wysoki / Ponadprzeciętny (Superior)';
    if (iq >= 110) return 'Wysoka norma (High Average)';
    if (iq >= 90) return 'Norma przeciętna (Average)';
    if (iq >= 80) return 'Niska norma (Low Average)';
    if (iq >= 70) return 'Graniczny (Borderline)';
    return 'Bardzo niski (Extremely Low)';
  }
}
