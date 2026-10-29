/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useMemo } from 'react';
import { OptionId, Question } from '../../core/models/types';
import { MatrixPattern } from '../../graphics/models/matrixTypes';
import { CanvasMatrixRenderer } from '../../graphics/renderers/CanvasMatrixRenderer';
import { MatrixCanvas } from './MatrixCanvas';
import { OptionButton } from './OptionButton';
import { ProgressBar } from './ProgressBar';
import { TimerComponent } from './TimerComponent';

interface QuizViewProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  onSelectOption: (optionId: OptionId, responseTime: number) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  question,
  currentIndex,
  totalQuestions,
  onSelectOption,
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<OptionId | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const renderer = useMemo(() => new CanvasMatrixRenderer(), []);

  // Timer loop for the current question
  useEffect(() => {
    setElapsedSeconds(0);
    setSelectedOptionId(null);
    setIsSubmitting(false);

    const startTime = performance.now();
    const interval = setInterval(() => {
      const now = performance.now();
      setElapsedSeconds((now - startTime) / 1000);
    }, 100);

    return () => clearInterval(interval);
  }, [question.id]);

  // Handle option selection
  const handleSelect = (id: OptionId) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSelectedOptionId(id);

    // Short tactile delay to let the selection state be perceived
    setTimeout(() => {
      onSelectOption(id, Math.max(0.2, Number(elapsedSeconds.toFixed(2))));
    }, 160);
  };

  // Keyboard shortcut support [A, B, C, D]
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSubmitting) return;
      const key = e.key.toUpperCase();
      if (key === 'A' || key === 'B' || key === 'C' || key === 'D') {
        e.preventDefault();
        handleSelect(key as OptionId);
      } else if (key === '1') {
        e.preventDefault();
        handleSelect('A');
      } else if (key === '2') {
        e.preventDefault();
        handleSelect('B');
      } else if (key === '3') {
        e.preventDefault();
        handleSelect('C');
      } else if (key === '4') {
        e.preventDefault();
        handleSelect('D');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSubmitting, elapsedSeconds, handleSelect]);

  const pattern = question.matrixData as MatrixPattern;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header Controls: Progress & Timer */}
      <div className="space-y-4">
        <ProgressBar
          currentIndex={currentIndex}
          total={totalQuestions}
          difficulty={question.difficulty}
          category={question.category}
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <span>{pattern.name || 'Zagadka Matrycowa'}</span>
            <span className="text-xs text-slate-400 font-normal">
              — {question.ruleDescription}
            </span>
          </div>

          <TimerComponent
            elapsedSeconds={elapsedSeconds}
            tBase={question.tBase}
          />
        </div>
      </div>

      {/* Main 2-Column Responsive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 3x3 Matrix Canvas Display (7 cols) */}
        <div className="lg:col-span-7 flex justify-center">
          <MatrixCanvas pattern={pattern} renderer={renderer} />
        </div>

        {/* Right: Answer Choices A, B, C, D (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1 pb-1 border-b border-slate-800">
            <span>Wybierz rozwiązanie:</span>
            <span className="font-mono text-slate-500">Skróty: [A] [B] [C] [D]</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
            {question.options.map((opt) => {
              const cellCandidate = pattern.options[opt.id];
              return (
                <OptionButton
                  key={opt.id}
                  id={opt.id}
                  label={opt.label}
                  cell={cellCandidate}
                  renderer={renderer}
                  isSelected={selectedOptionId === opt.id}
                  isDisabled={isSubmitting}
                  onSelect={handleSelect}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
