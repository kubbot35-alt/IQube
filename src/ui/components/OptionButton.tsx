/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { OptionId } from '../../core/models/types';
import { MatrixCell } from '../../graphics/models/matrixTypes';
import { CanvasMatrixRenderer } from '../../graphics/renderers/CanvasMatrixRenderer';

interface OptionButtonProps {
  id: OptionId;
  label: string;
  cell: MatrixCell;
  renderer: CanvasMatrixRenderer;
  isSelected: boolean;
  isDisabled: boolean;
  onSelect: (id: OptionId) => void;
}

export const OptionButton: React.FC<OptionButtonProps> = ({
  id,
  label,
  cell,
  renderer,
  isSelected,
  isDisabled,
  onSelect,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    renderer.renderCell(canvas, cell);
  }, [cell, renderer]);

  return (
    <button
      onClick={() => onSelect(id)}
      disabled={isDisabled}
      aria-label={`Wybierz wariant ${id}: ${label}`}
      className={`group relative flex items-center p-3 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
        isSelected
          ? 'bg-indigo-950/70 border-indigo-500 shadow-lg shadow-indigo-950/50 ring-1 ring-indigo-500'
          : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
      } ${isDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}
    >
      {/* Option Key Badge */}
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-sm shrink-0 mr-3.5 transition-colors ${
          isSelected
            ? 'bg-indigo-600 text-white shadow-md'
            : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700 group-hover:text-white'
        }`}
      >
        {id}
      </div>

      {/* Vector Preview Canvas */}
      <div className="w-16 h-16 rounded-lg bg-slate-950 border border-slate-800 p-1 shrink-0 overflow-hidden flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="w-full h-full block rounded"
        />
      </div>

      {/* Option label & description */}
      <div className="ml-3 min-w-0 flex-1">
        <div className="text-sm font-medium text-slate-200 group-hover:text-white truncate">
          Wariant {id}
        </div>
        <div className="text-xs text-slate-400 truncate mt-0.5">
          {label}
        </div>
      </div>
    </button>
  );
};
