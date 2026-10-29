/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Download, RotateCcw, Eye, ShieldCheck, Zap, Activity, Clock, Layers, Maximize2 } from 'lucide-react';
import { IQScoreResult, Question } from '../../core/models/types';
import { ThreeJsResultVisualizer } from '../../visualizer/three/ThreeJsResultVisualizer';
import { ResultCardExporter } from '../../visualizer/three/ResultCardExporter';

interface ResultScreenProps {
  result: IQScoreResult;
  questions: Question[];
  onRestart: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  result,
  questions,
  onRestart,
}) => {
  const threeMountRef = useRef<HTMLDivElement | null>(null);
  const visualizerRef = useRef<ThreeJsResultVisualizer | null>(null);

  const [viewMode, setViewMode] = useState<'combined' | 'gaussian' | 'neural'>('combined');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [showReview, setShowReview] = useState<boolean>(false);
  const [isHudCollapsed, setIsHudCollapsed] = useState<boolean>(false);

  const exporter = useMemo(() => new ResultCardExporter(), []);

  // Mount Three.js Visualizer
  useEffect(() => {
    if (!threeMountRef.current) return;

    const visualizer = new ThreeJsResultVisualizer();
    visualizer.mount(threeMountRef.current, result);
    visualizerRef.current = visualizer;

    return () => {
      visualizer.unmount();
      visualizerRef.current = null;
    };
  }, [result]);

  const handleModeChange = (mode: 'combined' | 'gaussian' | 'neural') => {
    setViewMode(mode);
    visualizerRef.current?.setViewMode(mode);
  };

  const handleToggleRotate = () => {
    const next = !autoRotate;
    setAutoRotate(next);
    visualizerRef.current?.toggleAutoRotate(next);
  };

  const handleResetCamera = () => {
    visualizerRef.current?.resetCamera();
  };

  const handleDownloadCertificate = async () => {
    try {
      setIsExporting(true);
      await exporter.downloadCard(result);
    } catch (err) {
      console.error('Failed to export certificate:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* 1. Hero Score Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Raport Psychometryczny · Skala Wechslera</span>
            </div>

            <div className="flex items-baseline gap-4">
              <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white font-mono tabular-nums">
                IQ {result.iqScore}
              </h1>
              <div className="text-sm sm:text-base font-semibold text-cyan-400">
                Centyl: {result.percentile}%
              </div>
            </div>

            <p className="text-base sm:text-lg text-slate-200 font-medium">
              {result.classification}
            </p>

            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              Twój wynik plasuje się wyżej niż u <strong>{result.percentile}%</strong> populacji ogólnej
              w rozkładzie normalnym (μ = 100, σ = 15). Wynik uwzględnia trafność rozwiązań
              oraz wskaźnik automatyzmu poznawczego.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <button
              onClick={handleDownloadCertificate}
              disabled={isExporting}
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Generowanie...' : 'Pobierz Certyfikat PNG'}</span>
            </button>

            <button
              onClick={onRestart}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 font-medium text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Powtórz Test</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Interactive Three.js 3D Viewport with Bottom Dock */}
      <div className="rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden relative">
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Activity className="w-4 h-4 text-indigo-400" />
            <span>Trójwymiarowa Przestrzeń Psychometryczna (Three.js)</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
            Przeciągnij myszą, aby obracać widok 3D
          </span>
        </div>

        {/* 3D Canvas Mount Point */}
        <div className="w-full h-[440px] sm:h-[500px] relative bg-slate-950 select-none">
          <div ref={threeMountRef} className="w-full h-full" />

          {/* Collapsible Bottom Control Dock */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[92%] max-w-lg">
            <div className="flex flex-col items-center">
              <button
                onClick={() => setIsHudCollapsed(!isHudCollapsed)}
                className="mb-1 px-3 py-1 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-[10px] text-slate-400 rounded-full transition-colors cursor-pointer"
              >
                {isHudCollapsed ? '▴ Pokaż Sterowanie 3D' : '▾ Ukryj Sterowanie 3D'}
              </button>

              {!isHudCollapsed && (
                <div className="w-full p-2 bg-slate-900/90 border border-slate-800 rounded-xl shadow-xl flex items-center justify-between gap-2 text-xs">
                  {/* Mode Selector */}
                  <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800/60">
                    <button
                      onClick={() => handleModeChange('combined')}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                        viewMode === 'combined'
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Pełny
                    </button>
                    <button
                      onClick={() => handleModeChange('gaussian')}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                        viewMode === 'gaussian'
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Krzywa Gaussa
                    </button>
                    <button
                      onClick={() => handleModeChange('neural')}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                        viewMode === 'neural'
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Synapsy
                    </button>
                  </div>

                  {/* Camera & Rotation Helpers */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleToggleRotate}
                      className={`px-2.5 py-1 text-[11px] font-medium rounded-lg border transition-colors cursor-pointer ${
                        autoRotate
                          ? 'bg-slate-800 border-indigo-500/40 text-indigo-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {autoRotate ? 'Obrót: WŁ' : 'Obrót: WYŁ'}
                    </button>
                    <button
                      onClick={handleResetCamera}
                      title="Wycentruj kamerę"
                      className="p-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Detailed Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Trafność Ogólna</span>
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">
            {result.correctCount} / {result.totalQuestions}
          </div>
          <div className="text-xs text-slate-500 font-mono">
            {result.accuracyPercentage}% poprawnych
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Średni Czas Reakcji</span>
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">
            {result.averageTimeSeconds}s
          </div>
          <div className="text-xs text-slate-500 font-mono">
            Całkowity czas: {Math.round(result.totalTimeSeconds)}s
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Premia za Automatyzm</span>
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">
            +{result.speedBonusAccumulated.toFixed(2)}
          </div>
          <div className="text-xs text-slate-500">
            Bonus za odpowiedzi poniżej czasu bazowego T_base
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Wynik Surowy (S_total)</span>
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">
            {result.rawScoreTotal}
          </div>
          <div className="text-xs text-slate-500 font-mono">
            z {result.maxPossibleRaw} maks.
          </div>
        </div>
      </div>

      {/* 4. Tier Breakdown: Easy, Medium, Hard */}
      <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 space-y-4">
        <h2 className="text-sm font-semibold text-slate-200">
          Rozbicie według stopni trudności
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-medium text-emerald-400">
              <span>Łatwe (D=1, t_base=20s)</span>
              <span>
                {result.breakdownByDifficulty.easy.correct} /{' '}
                {result.breakdownByDifficulty.easy.total}
              </span>
            </div>
            <div className="text-xs text-slate-400">
              Śr. czas: {result.breakdownByDifficulty.easy.avgTime.toFixed(1)}s
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-medium text-amber-400">
              <span>Średnie (D=2, t_base=40s)</span>
              <span>
                {result.breakdownByDifficulty.medium.correct} /{' '}
                {result.breakdownByDifficulty.medium.total}
              </span>
            </div>
            <div className="text-xs text-slate-400">
              Śr. czas: {result.breakdownByDifficulty.medium.avgTime.toFixed(1)}s
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-medium text-rose-400">
              <span>Trudne (D=3, t_base=70s)</span>
              <span>
                {result.breakdownByDifficulty.hard.correct} /{' '}
                {result.breakdownByDifficulty.hard.total}
              </span>
            </div>
            <div className="text-xs text-slate-400">
              Śr. czas: {result.breakdownByDifficulty.hard.avgTime.toFixed(1)}s
            </div>
          </div>
        </div>
      </div>

      {/* 5. Question Review Accordion */}
      <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-200">
            Szczegółowy przegląd pytań i reguł logicznych
          </h2>
          <button
            onClick={() => setShowReview(!showReview)}
            className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showReview ? 'Zwiń przegląd' : 'Rozwiń wszystkie zadania'}</span>
          </button>
        </div>

        {showReview && (
          <div className="space-y-3 pt-2">
            {result.answers.map((ans, idx) => {
              const q = questions.find((item) => item.id === ans.questionId);
              return (
                <div
                  key={ans.questionId}
                  className={`p-3.5 rounded-lg border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    ans.isCorrect
                      ? 'bg-slate-950/70 border-emerald-900/40 text-slate-300'
                      : 'bg-slate-950/70 border-rose-900/40 text-slate-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">
                        Zadanie {idx + 1}
                      </span>
                      <span className="text-slate-600">·</span>
                      <span
                        className={
                          ans.isCorrect ? 'text-emerald-400 font-medium' : 'text-rose-400 font-medium'
                        }
                      >
                        {ans.isCorrect ? 'Poprawna' : 'Błędna'}
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className="text-slate-400">
                        Twój wybór: <strong>{ans.selectedOptionId}</strong> (Prawidłowa: <strong>{q?.correctOptionId}</strong>)
                      </span>
                    </div>
                    <div className="text-slate-400">
                      Reguła: {q?.ruleDescription}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 font-mono text-[11px] text-slate-400">
                    <span>{ans.responseTimeSeconds}s</span>
                    <span>Wynik: {ans.rawScore.toFixed(2)} pkt</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
