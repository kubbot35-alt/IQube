/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DifficultyLevel } from '../../core/models/types';

interface ProgressBarProps {
  currentIndex: number;
  total: number;
  difficulty: DifficultyLevel;
  category: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentIndex,
  total,
  difficulty,
  category,
}) => {
  const percent = Math.min(100, Math.round(((currentIndex - 1) / total) * 100));

  const difficultyLabel =
    difficulty === 1 ? 'Łatwe (D=1)' : difficulty === 2 ? 'Średnie (D=2)' : 'Trudne (D=3)';

  const difficultyColor =
    difficulty === 1
      ? 'text-emerald-400'
      : difficulty === 2
      ? 'text-amber-400'
      : 'text-rose-400';

  const categoryNames: Record<string, string> = {
    rotation: 'Rotacja wektorowa',
    progression: 'Progresja sekwencji',
    boolean_logic: 'Rachunek logiczny XOR/OR',
    spatial_relations: 'Relacje przestrzenne',
    symmetry: 'Symetria i inwersja',
    matrix_arithmetic: 'Arytmetyka matrycowa',
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-200">
            Pytanie {currentIndex} z {total}
          </span>
          <span className="text-slate-600">·</span>
          <span className={`font-medium ${difficultyColor}`}>{difficultyLabel}</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400 hidden sm:inline">
            {categoryNames[category] || category}
          </span>
        </div>
        <div className="font-mono tabular-nums text-slate-300 font-medium">
          {percent}% ukończono
        </div>
      </div>

      {/* Progress track */}
      <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800/80">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-cyan-400 transition-all duration-300 ease-out"
          style={{ width: `${Math.max(4, percent)}%` }}
        />
      </div>
    </div>
  );
};
