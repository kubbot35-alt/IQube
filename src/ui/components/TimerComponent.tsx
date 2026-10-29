/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Clock, Zap, AlertTriangle } from 'lucide-react';

interface TimerComponentProps {
  elapsedSeconds: number;
  tBase: number;
}

export const TimerComponent: React.FC<TimerComponentProps> = ({
  elapsedSeconds,
  tBase,
}) => {
  const isOvertime = elapsedSeconds > tBase;
  const ratio = elapsedSeconds / tBase;
  const clampedPercentage = Math.min(100, Math.round(ratio * 100));

  // Remaining or overtime seconds
  const formattedElapsed = elapsedSeconds.toFixed(1);

  return (
    <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 rounded-lg px-3.5 py-2">
      <div className="flex items-center gap-2">
        <Clock
          className={`w-4 h-4 ${
            isOvertime ? 'text-amber-400' : 'text-indigo-400'
          }`}
        />
        <div className="flex items-baseline gap-1.5">
          <span className="font-mono tabular-nums text-sm font-semibold text-white">
            {formattedElapsed}s
          </span>
          <span className="text-xs text-slate-500 font-mono">
            / {tBase}s bazowo
          </span>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-1.5 text-xs">
        <span className="text-slate-700">|</span>
        {!isOvertime ? (
          <span className="text-emerald-400 flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Strefa bonusu czasowego (do +25%)
          </span>
        ) : (
          <span className="text-amber-400 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Przekroczono bazowy czas
          </span>
        )}
      </div>

      {/* Mini indicator bar */}
      <div className="w-16 h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 ml-auto hidden xs:block">
        <div
          className={`h-full transition-all duration-150 ${
            isOvertime ? 'bg-amber-500' : 'bg-indigo-500'
          }`}
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>
    </div>
  );
};
