/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { IQScoreResult, OptionId, Question, QuizState } from './core/models/types';
import { IQCalculatorService } from './core/services/IQCalculatorService';
import { QuizEngine } from './core/services/QuizEngine';
import { QUESTION_BANK } from './graphics/data/questionBank';
import { Header } from './ui/components/Header';
import { MethodologyModal } from './ui/components/MethodologyModal';
import { QuizView } from './ui/components/QuizView';
import { ResultScreen } from './ui/components/ResultScreen';
import { StartScreen } from './ui/components/StartScreen';

export default function App() {
  const [quizState, setQuizState] = useState<QuizState>('idle');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [result, setResult] = useState<IQScoreResult | null>(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);

  // Initialize domain services once
  const calculator = useMemo(() => new IQCalculatorService(), []);
  const quizEngine = useMemo(() => new QuizEngine(QUESTION_BANK, calculator), [calculator]);

  // Subscribe to QuizEngine progress events
  useEffect(() => {
    const unsubscribe = quizEngine.subscribe((progress) => {
      setQuizState(progress.state);
      setCurrentIndex(progress.currentIndex + 1);
      setCurrentQuestion(progress.currentQuestion);
      if (progress.state === 'completed') {
        setResult(quizEngine.getResult());
      }
    });

    return () => unsubscribe();
  }, [quizEngine]);

  const handleStart = useCallback(() => {
    quizEngine.start();
  }, [quizEngine]);

  const handleRestart = useCallback(() => {
    quizEngine.reset();
    setResult(null);
  }, [quizEngine]);

  const handleSelectOption = useCallback(
    (optionId: OptionId, responseTime: number) => {
      quizEngine.submitAnswer(optionId, responseTime);
    },
    [quizEngine]
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* 3-zone Top Bar */}
      <Header
        onRestart={handleRestart}
        onOpenInfo={() => setIsInfoModalOpen(true)}
        state={quizState}
        questionIndex={currentIndex}
        totalQuestions={QUESTION_BANK.length}
      />

      {/* Main Container */}
      <main className="flex-1 flex flex-col justify-center">
        {quizState === 'idle' && (
          <StartScreen
            onStart={handleStart}
            questionCount={QUESTION_BANK.length}
          />
        )}

        {quizState === 'running' && currentQuestion && (
          <QuizView
            question={currentQuestion}
            currentIndex={currentIndex}
            totalQuestions={QUESTION_BANK.length}
            onSelectOption={handleSelectOption}
          />
        )}

        {quizState === 'completed' && result && (
          <ResultScreen
            result={result}
            questions={QUESTION_BANK}
            onRestart={handleRestart}
          />
        )}
      </main>

      {/* Methodology Modal */}
      <MethodologyModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />

      {/* Subtle Footer */}
      <footer className="w-full border-t border-slate-900 py-4 px-6 text-center text-xs text-slate-500 font-normal">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2">
          <span>IQube Psychometric Engine</span>
          <span className="hidden sm:inline text-slate-700">·</span>
          <span>Autor: <strong className="text-slate-400 font-medium">@kubbot35-alt</strong></span>
          <span className="hidden sm:inline text-slate-700">·</span>
          <span>Licencja MIT</span>
        </div>
      </footer>
    </div>
  );
}
