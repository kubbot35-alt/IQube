/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, BookOpen, Clock, BarChart3, ShieldCheck } from 'lucide-react';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <h2 className="text-base font-semibold text-white">
              Metodologia Psychometryczna IQube
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto text-xs text-slate-300 leading-relaxed">
          {/* Section 1 */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              1. Inteligencja Płynna (g_f) i Matryce Progresywne
            </h3>
            <p className="text-slate-400">
              Test bada zdolność logicznego myślenia i rozwiązywania problemów w nowatorskich
              sytuacjach, niezależnie od nabytej wiedzy czy kultury językowej (Test Matryc Progresywnych
              Ravena / skala Wechslera WAIS-IV).
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-cyan-400" />
              2. Adaptacyjny Algorytm Czasu Reakcji
            </h3>
            <p className="text-slate-400">
              Tradycyjne testy oceniają jedynie binarną poprawność (0 lub 1). Nasz model
              uwzględnia czas namysłu t w stosunku do referencyjnego czasu T_base dla danego
              poziomu trudności (D = 1, 2 lub 3):
            </p>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg font-mono text-[11px] text-indigo-200">
              • Jeśli poprawna i t ≤ T_base: <br />
              &nbsp;&nbsp; S_i = D_i · [1 + 0.25 · (T_base - t) / T_base] (premia do +25%)<br /><br />
              • Jeśli poprawna i t &gt; T_base: <br />
              &nbsp;&nbsp; S_i = D_i · max[0.30, 1 - 0.50 · (t - T_base) / T_base]<br /><br />
              • Jeśli błędna: S_i = 0
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              3. Normalizacja Gaussa (μ = 100, σ = 15)
            </h3>
            <p className="text-slate-400">
              Wynik surowy $S_{'{'}total{'}'}$ jest mapowany na krzywą dzwonową Gaussa.
              Wynik IQ 100 stanowi medianę populacji, natomiast 15 punktów to jedno odchylenie
              standardowe (standard WAIS).
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
};
