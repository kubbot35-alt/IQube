/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Brain, RotateCcw, Info } from 'lucide-react';

interface HeaderProps {
  onRestart: () => void;
  onOpenInfo: () => void;
  state: 'idle' | 'running' | 'completed';
  questionIndex?: number;
  totalQuestions?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onRestart,
  onOpenInfo,
  state,
  questionIndex,
  totalQuestions,
}) => {
  return (
    <header className="w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Brain className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
            IQube
          </span>
        </div>

        {/* Zone 2: Informational / status navigation */}
        <nav className="hidden md:flex items-center gap-6 text-xs text-slate-400 font-medium">
          <button
            onClick={onOpenInfo}
            className="hover:text-slate-200 transition-colors cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Info className="w-3.5 h-3.5 text-indigo-400" />
            <span>Metodologia Psychometryczna</span>
          </button>
          <span className="text-slate-700">|</span>
          <span className="whitespace-nowrap shrink-0">
            Krzywa Gaussa (μ=100, σ=15)
          </span>
          {state === 'running' && questionIndex !== undefined && totalQuestions !== undefined && (
            <>
              <span className="text-slate-700">|</span>
              <span className="font-mono tabular-nums text-indigo-300 font-semibold whitespace-nowrap shrink-0">
                Zadanie {questionIndex} z {totalQuestions}
              </span>
            </>
          )}
        </nav>

        {/* Zone 3: Primary action button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onRestart}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/60 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
            title="Rozpocznij test od nowa"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
