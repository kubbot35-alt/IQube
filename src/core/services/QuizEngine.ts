/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IIQCalculator } from '../interfaces/IIQCalculator';
import { IQuizEngine, QuizEngineListener, QuizProgress } from '../interfaces/IQuizEngine';
import { IQScoreResult, OptionId, Question, QuizState, UserAnswer } from '../models/types';

export class QuizEngine implements IQuizEngine {
  private questions: Question[];
  private calculator: IIQCalculator;
  private state: QuizState = 'idle';
  private currentIndex: number = 0;
  private answers: UserAnswer[] = [];
  private listeners: Set<QuizEngineListener> = new Set();
  private finalResult: IQScoreResult | null = null;
  private totalElapsedSeconds: number = 0;
  private currentQuestionElapsedSeconds: number = 0;

  constructor(questions: Question[], calculator: IIQCalculator) {
    this.questions = questions;
    this.calculator = calculator;
  }

  public getState(): QuizState {
    return this.state;
  }

  public getQuestions(): Question[] {
    return [...this.questions];
  }

  public getCurrentQuestion(): Question | null {
    if (this.state !== 'running' || this.currentIndex >= this.questions.length) {
      return null;
    }
    return this.questions[this.currentIndex];
  }

  public getProgress(): QuizProgress {
    return {
      currentIndex: this.currentIndex,
      totalQuestions: this.questions.length,
      currentQuestion: this.getCurrentQuestion(),
      answeredCount: this.answers.length,
      elapsedTotalSeconds: this.totalElapsedSeconds,
      currentQuestionElapsedSeconds: this.currentQuestionElapsedSeconds,
      state: this.state,
    };
  }

  public start(): void {
    if (this.questions.length === 0) {
      throw new Error('Nie można rozpocząć testu bez pytań.');
    }
    this.state = 'running';
    this.currentIndex = 0;
    this.answers = [];
    this.finalResult = null;
    this.totalElapsedSeconds = 0;
    this.currentQuestionElapsedSeconds = 0;
    this.notify();
  }

  public submitAnswer(selectedOptionId: OptionId, responseTimeSeconds: number): UserAnswer {
    if (this.state !== 'running') {
      throw new Error('Test nie jest aktywny.');
    }

    const currentQuestion = this.questions[this.currentIndex];
    if (!currentQuestion) {
      throw new Error('Brak aktywnego pytania.');
    }

    const isCorrect = selectedOptionId === currentQuestion.correctOptionId;
    const scoreDetail = this.calculator.calculateQuestionScore(
      currentQuestion.difficulty,
      currentQuestion.tBase,
      responseTimeSeconds,
      isCorrect
    );

    const userAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      questionIndex: this.currentIndex + 1,
      selectedOptionId,
      isCorrect,
      responseTimeSeconds,
      tBase: currentQuestion.tBase,
      difficulty: currentQuestion.difficulty,
      rawScore: scoreDetail.score,
      speedBonus: scoreDetail.speedBonus,
      timePenalty: scoreDetail.penalty,
    };

    this.answers.push(userAnswer);
    this.totalElapsedSeconds += responseTimeSeconds;

    // Advance to next or finish
    if (this.currentIndex + 1 < this.questions.length) {
      this.currentIndex += 1;
      this.currentQuestionElapsedSeconds = 0;
      this.notify();
    } else {
      this.finish();
    }

    return userAnswer;
  }

  public finish(): IQScoreResult {
    this.state = 'completed';
    this.finalResult = this.calculator.calculateScore(this.answers, this.questions);
    this.notify();
    return this.finalResult;
  }

  public getResult(): IQScoreResult | null {
    return this.finalResult;
  }

  public reset(): void {
    this.state = 'idle';
    this.currentIndex = 0;
    this.answers = [];
    this.finalResult = null;
    this.totalElapsedSeconds = 0;
    this.currentQuestionElapsedSeconds = 0;
    this.notify();
  }

  public subscribe(listener: QuizEngineListener): () => void {
    this.listeners.add(listener);
    listener(this.getProgress());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    const progress = this.getProgress();
    this.listeners.forEach((l) => l(progress));
  }
}
