/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Play, Sparkles, Clock, Target, CheckCircle2, ShieldCheck } from 'lucide-react';

interface StartScreenProps {
  onStart: () => void;
  questionCount: number;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart, questionCount }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Hero Badge & Title */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/70 border border-indigo-800/60 text-xs font-medium text-indigo-300">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Zaawansowany Model Psychometryczny AI Studio</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight text-balance">
          IQube
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
          Test inteligencji płynnej oparty na matrycach progresywnych z adaptacyjnym
          modelem czasu reakcji i normalizacją do rozkładu Gaussa (μ = 100, σ = 15).
        </p>
      </div>

      {/* 3 Core pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Target className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-semibold text-white">20 Zadań Matrycowych</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Stopniowy wzrost trudności: rotacje kątowe, operacje logiczne XOR, symetria
            oraz relacje przestrzenne.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Clock className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-semibold text-white">Ważenie Czasu Reakcji</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Algorytm premiuje automatyzm poznawczy (bonus do +25%) oraz eliminuje
            zgadywanie poprzez stopniową redukcję punktów za przekroczenie czasu bazowego.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-semibold text-white">Wizualizacja 3D & Certyfikat</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Interaktywny model Three.js sieci neuronowej i krzywej Gaussa wraz z
            możliwością eksportu certyfikatu do pliku PNG w wysokiej rozdzielczości.
          </p>
        </div>
      </div>

      {/* Instruction list */}
      <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-6 mb-8 space-y-3">
        <h3 className="text-sm font-semibold text-slate-200">Wskazówki przed przystąpieniem:</h3>
        <ul className="text-xs text-slate-400 space-y-2">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Przygotuj spokojne miejsce bez rozpraszaczy. Szacowany czas sesji: <strong>10–14 minut</strong>.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Każde zadanie to siatka 3x3 z brakującym 9. polem. Wybierz jeden wariant spośród A, B, C, D.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Możesz klikać myszą lub używać klawiszy <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700 font-mono text-[10px]">A</kbd>, <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700 font-mono text-[10px]">B</kbd>, <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700 font-mono text-[10px]">C</kbd>, <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700 font-mono text-[10px]">D</kbd>.</span>
          </li>
        </ul>
      </div>

      {/* Start CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={onStart}
          className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Rozpocznij Test IQ ({questionCount} pytań)</span>
        </button>
      </div>
    </div>
  );
};
