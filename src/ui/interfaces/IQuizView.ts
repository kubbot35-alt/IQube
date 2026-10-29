/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IQScoreResult, OptionId, Question } from '../../core/models/types';

export interface QuizViewHandlers {
  onSelectOption: (optionId: OptionId) => void;
  onStartQuiz: () => void;
  onRestartQuiz: () => void;
  onToggleReview?: () => void;
}

export interface IQuizViewProps {
  currentQuestion: Question | null;
  currentIndex: number;
  totalQuestions: number;
  timeSpentSeconds: number;
  isSubmitting?: boolean;
  selectedOptionId?: OptionId | null;
  handlers: QuizViewHandlers;
  result?: IQScoreResult | null;
}
