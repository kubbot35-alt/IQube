/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Question } from '../../core/models/types';
import { MatrixCell, MatrixPattern } from '../models/matrixTypes';

function makeCell(shapes: MatrixCell['shapes'], isMissing = false): MatrixCell {
  return { shapes, isMissing };
}

export const QUESTION_BANK: Question[] = [
  // --- 1. EASY (D=1, tBase=20s) - Count progression of dots
  {
    id: 'q1',
    index: 1,
    difficulty: 1,
    tBase: 20,
    category: 'progression',
    ruleDescription: 'Liczba elementów wzrasta o 1 w każdym wierszu od lewej do prawej.',
    matrixData: {
      id: 'p1',
      name: 'Progresja ilościowa',
      description: 'Liczba punktów w komórce',
      grid: [
        makeCell([{ type: 'dots', count: 1, layout: 'horizontal', color: '#38bdf8' }]),
        makeCell([{ type: 'dots', count: 2, layout: 'horizontal', color: '#38bdf8' }]),
        makeCell([{ type: 'dots', count: 3, layout: 'horizontal', color: '#38bdf8' }]),

        makeCell([{ type: 'square', count: 1, size: 0.5, color: '#a78bfa' }]),
        makeCell([{ type: 'square', count: 2, layout: 'horizontal', size: 0.5, color: '#a78bfa' }]),
        makeCell([{ type: 'square', count: 3, layout: 'horizontal', size: 0.5, color: '#a78bfa' }]),

        makeCell([{ type: 'triangle', count: 1, size: 0.5, color: '#34d399' }]),
        makeCell([{ type: 'triangle', count: 2, layout: 'horizontal', size: 0.5, color: '#34d399' }]),
        makeCell([], true), // 9th missing
      ],
      options: {
        A: makeCell([{ type: 'triangle', count: 4, layout: 'horizontal', size: 0.5, color: '#34d399' }]),
        B: makeCell([{ type: 'triangle', count: 3, layout: 'horizontal', size: 0.5, color: '#34d399' }]),
        C: makeCell([{ type: 'square', count: 3, layout: 'horizontal', size: 0.5, color: '#a78bfa' }]),
        D: makeCell([{ type: 'triangle', count: 1, size: 0.5, color: '#34d399' }]),
      },
    } as MatrixPattern,
    options: [
      { id: 'A', label: '4 Trójkąty' },
      { id: 'B', label: '3 Trójkąty (Poprawna)' },
      { id: 'C', label: '3 Kwadraty' },
      { id: 'D', label: '1 Trójkąt' },
    ],
    correctOptionId: 'B',
  },

  // --- 2. EASY (D=1, tBase=20s) - 90 degree clockwise rotation
  {
    id: 'q2',
    index: 2,
    difficulty: 1,
    tBase: 20,
    category: 'rotation',
    ruleDescription: 'Strzałka obraca się o 90 stopni zgodnie z ruchem wskazówek zegara.',
    matrixData: {
      id: 'p2',
      name: 'Rotacja wektora 90°',
      description: 'Cykliczny obrót w prawo',
      grid: [
        makeCell([{ type: 'arrow', rotation: 0, size: 0.6, color: '#60a5fa' }]),
        makeCell([{ type: 'arrow', rotation: 90, size: 0.6, color: '#60a5fa' }]),
        makeCell([{ type: 'arrow', rotation: 180, size: 0.6, color: '#60a5fa' }]),

        makeCell([{ type: 'arrow', rotation: 90, size: 0.6, color: '#f472b6' }]),
        makeCell([{ type: 'arrow', rotation: 180, size: 0.6, color: '#f472b6' }]),
        makeCell([{ type: 'arrow', rotation: 270, size: 0.6, color: '#f472b6' }]),

        makeCell([{ type: 'arrow', rotation: 180, size: 0.6, color: '#fbbf24' }]),
        makeCell([{ type: 'arrow', rotation: 270, size: 0.6, color: '#fbbf24' }]),
        makeCell([], true),
      ],
      options: {
        A: makeCell([{ type: 'arrow', rotation: 0, size: 0.6, color: '#fbbf24' }]),
        B: makeCell([{ type: 'arrow', rotation: 90, size: 0.6, color: '#fbbf24' }]),
        C: makeCell([{ type: 'arrow', rotation: 180, size: 0.6, color: '#fbbf24' }]),
        D: makeCell([{ type: 'arrow', rotation: 270, size: 0.6, color: '#fbbf24' }]),
      },
    } as MatrixPattern,
    options: [
      { id: 'A', label: 'Skierowana w górę (0°)' },
      { id: 'B', label: 'Skierowana w prawo (90°)' },
      { id: 'C', label: 'Skierowana w dół (180°)' },
      { id: 'D', label: 'Skierowana w lewo (270°)' },
    ],
    correctOptionId: 'A',
  },

  // --- 3. EASY (D=1, tBase=20s) - Fill progression (pusty -> paskowany -> pełny)
  {
    id: 'q3',
    index: 3,
    difficulty: 1,
    tBase: 20,
    category: 'progression',
    ruleDescription: 'Wypełnienie figury zmienia się z pustego przez paskowane na pełne wypełnienie.',
    matrixData: {
      id: 'p3',
      name: 'Ewolucja tekstury',
      description: 'Pusty -> Kreskowany -> Pełny',
      grid: [
        makeCell([{ type: 'circle', fill: 'none', size: 0.6, color: '#38bdf8' }]),
        makeCell([{ type: 'circle', fill: 'striped', size: 0.6, color: '#38bdf8' }]),
        makeCell([{ type: 'circle', fill: 'solid', size: 0.6, color: '#38bdf8' }]),

        makeCell([{ type: 'square', fill: 'none', size: 0.55, color: '#818cf8' }]),
        makeCell([{ type: 'square', fill: 'striped', size: 0.55, color: '#818cf8' }]),
        makeCell([{ type: 'square', fill: 'solid', size: 0.55, color: '#818cf8' }]),

        makeCell([{ type: 'diamond', fill: 'none', size: 0.6, color: '#ec4899' }]),
        makeCell([{ type: 'diamond', fill: 'striped', size: 0.6, color: '#ec4899' }]),
        makeCell([], true),
      ],
      options: {
        A: makeCell([{ type: 'diamond', fill: 'none', size: 0.6, color: '#ec4899' }]),
        B: makeCell([{ type: 'circle', fill: 'solid', size: 0.6, color: '#38bdf8' }]),
        C: makeCell([{ type: 'diamond', fill: 'solid', size: 0.6, color: '#ec4899' }]),
        D: makeCell([{ type: 'diamond', fill: 'striped', size: 0.6, color: '#ec4899' }]),
      },
    } as MatrixPattern,
    options: [
      { id: 'A', label: 'Pusty romb' },
      { id: 'B', label: 'Pełne koło' },
      { id: 'C', label: 'Pełny romb' },
      { id: 'D', label: 'Paskowany romb' },
    ],
    correctOptionId: 'C',
  },

  // --- 4. EASY (D=1, tBase=20s) - Concentric nested shapes
  {
    id: 'q4',
    index: 4,
    difficulty: 1,
    tBase: 20,
    category: 'spatial_relations',
    ruleDescription: 'Zewnętrzna figura jest stała w wierszu, wewnętrzny kształt przechodzi przez stałą sekwencję (kropka -> koło -> romb).',
    matrixData: {
      id: 'p4',
      name: 'Relacja zagnieżdżenia',
      description: 'Zewnętrzny kontur + wewnętrzny rdzeń',
      grid: [
        makeCell([{ type: 'square', size: 0.7, color: '#94a3b8' }, { type: 'dots', size: 0.15, color: '#38bdf8' }]),
        makeCell([{ type: 'square', size: 0.7, color: '#94a3b8' }, { type: 'circle', size: 0.35, color: '#38bdf8' }]),
        makeCell([{ type: 'square', size: 0.7, color: '#94a3b8' }, { type: 'diamond', size: 0.35, color: '#38bdf8' }]),

        makeCell([{ type: 'circle', size: 0.7, color: '#94a3b8' }, { type: 'dots', size: 0.15, color: '#f59e0b' }]),
        makeCell([{ type: 'circle', size: 0.7, color: '#94a3b8' }, { type: 'circle', size: 0.35, color: '#f59e0b' }]),
        makeCell([{ type: 'circle', size: 0.7, color: '#94a3b8' }, { type: 'diamond', size: 0.35, color: '#f59e0b' }]),

        makeCell([{ type: 'hexagon', size: 0.7, color: '#94a3b8' }, { type: 'dots', size: 0.15, color: '#10b981' }]),
        makeCell([{ type: 'hexagon', size: 0.7, color: '#94a3b8' }, { type: 'circle', size: 0.35, color: '#10b981' }]),
        makeCell([], true),
      ],
      options: {
        A: makeCell([{ type: 'hexagon', size: 0.7, color: '#94a3b8' }, { type: 'diamond', size: 0.35, color: '#10b981' }]),
        B: makeCell([{ type: 'circle', size: 0.7, color: '#94a3b8' }, { type: 'diamond', size: 0.35, color: '#10b981' }]),
        C: makeCell([{ type: 'hexagon', size: 0.7, color: '#94a3b8' }, { type: 'square', size: 0.35, color: '#10b981' }]),
        D: makeCell([{ type: 'hexagon', size: 0.7, color: '#94a3b8' }, { type: 'dots', size: 0.15, color: '#10b981' }]),
      },
    } as MatrixPattern,
    options: [
      { id: 'A', label: 'Sześciokąt z rombem' },
      { id: 'B', label: 'Koło z rombem' },
      { id: 'C', label: 'Sześciokąt z kwadratem' },
      { id: 'D', label: 'Sześciokąt z kropką' },
    ],
    correctOptionId: 'A',
  },

  // --- 5. EASY (D=1, tBase=20s) - Size scale progression
  {
    id: 'q5',
    index: 5,
    difficulty: 1,
    tBase: 20,
    category: 'progression',
    ruleDescription: 'Skala elementu rośnie: mały (0.3) -> średni (0.5) -> duży (0.75).',
    matrixData: {
      id: 'p5',
      name: 'Gradacja skali',
      description: 'Zwiększanie rozmiaru figury',
      grid: [
        makeCell([{ type: 'circle', size: 0.3, color: '#c084fc' }]),
        makeCell([{ type: 'circle', size: 0.5, color: '#c084fc' }]),
        makeCell([{ type: 'circle', size: 0.75, color: '#c084fc' }]),

        makeCell([{ type: 'cross', size: 0.3, color: '#38bdf8' }]),
        makeCell([{ type: 'cross', size: 0.5, color: '#38bdf8' }]),
        makeCell([{ type: 'cross', size: 0.75, color: '#38bdf8' }]),

        makeCell([{ type: 'diamond', size: 0.3, color: '#f43f5e' }]),
        makeCell([{ type: 'diamond', size: 0.5, color: '#f43f5e' }]),
        makeCell([], true),
      ],
      options: {
        A: makeCell([{ type: 'diamond', size: 0.3, color: '#f43f5e' }]),
        B: makeCell([{ type: 'diamond', size: 0.5, color: '#f43f5e' }]),
        C: makeCell([{ type: 'diamond', size: 0.75, color: '#f43f5e' }]),
        D: makeCell([{ type: 'cross', size: 0.75, color: '#38bdf8' }]),
      },
    } as MatrixPattern,
    options: [
      { id: 'A', label: 'Mały romb' },
      { id: 'B', label: 'Średni romb' },
      { id: 'C', label: 'Duży romb' },
      { id: 'D', label: 'Duży krzyż' },
    ],
    correctOptionId: 'C',
  },

  // --- 6. EASY (D=1, tBase=20s) - Element Position Shift (Lewo -> Środek -> Prawo)
  {
    id: 'q6',
    index: 6,
    difficulty: 1,
    tBase: 20,
    category: 'spatial_relations',
    ruleDescription: 'Pozycja obiektu przesuwa się wzdłuż osi X: lewo (-0.25) -> środek (0) -> prawo (+0.25).',
    matrixData: {
      id: 'p6',
      name: 'Translacja horyzontalna',
      description: 'Pozycja elementu na osi poziomej',
      grid: [
        makeCell([{ type: 'circle', size: 0.4, offsetX: -0.25, color: '#34d399' }]),
        makeCell([{ type: 'circle', size: 0.4, offsetX: 0, color: '#34d399' }]),
        makeCell([{ type: 'circle', size: 0.4, offsetX: 0.25, color: '#34d399' }]),

        makeCell([{ type: 'square', size: 0.38, offsetX: -0.25, color: '#60a5fa' }]),
        makeCell([{ type: 'square', size: 0.38, offsetX: 0, color: '#60a5fa' }]),
        makeCell([{ type: 'square', size: 0.38, offsetX: 0.25, color: '#60a5fa' }]),

        makeCell([{ type: 'star', size: 0.42, offsetX: -0.25, color: '#fbbf24' }]),
        makeCell([{ type: 'star', size: 0.42, offsetX: 0, color: '#fbbf24' }]),
        makeCell([], true),
      ],
      options: {
        A: makeCell([{ type: 'star', size: 0.42, offsetX: -0.25, color: '#fbbf24' }]),
        B: makeCell([{ type: 'star', size: 0.42, offsetX: 0.25, color: '#fbbf24' }]),
        C: makeCell([{ type: 'star', size: 0.42, offsetX: 0, color: '#fbbf24' }]),
        D: makeCell([{ type: 'square', size: 0.38, offsetX: 0.25, color: '#60a5fa' }]),
      },
    } as MatrixPattern,
    options: [
      { id: 'A', label: 'Gwiazda po lewej' },
      { id: 'B', label: 'Gwiazda po prawej' },
      { id: 'C', label: 'Gwiazda w centrum' },
      { id: 'D', label: 'Kwadrat po prawej' },
    ],
    correctOptionId: 'B',
  },

  // --- 7. MEDIUM (D=2, tBase=40s) - Shape Superposition (Kolumna 1 + Kolumna 2 = Kolumna 3)
  {
    id: 'q7',
    index: 7,
    difficulty: 2,
    tBase: 40,
    category: 'boolean_logic',
    ruleDescription: 'Trzecia komórka w wierszu jest nałożeniem (sumą) figur z pierwszej i drugiej komórki.',
    matrixData: {
      id: 'p7',
      name: 'Superpozycja kształtów (OR)',
      description: 'Dodawanie geometryczne A + B = C',
      grid: [
        makeCell([{ type: 'circle', size: 0.6, color: '#38bdf8' }]),
        makeCell([{ type: 'cross', size: 0.5, color: '#f472b6' }]),
        makeCell([{ type: 'circle', size: 0.6, color: '#38bdf8' }, { type: 'cross', size: 0.5, color: '#f472b6' }]),

        makeCell([{ type: 'square', size: 0.55, color: '#34d399' }]),
        makeCell([{ type: 'diamond', size: 0.45, color: '#fbbf24' }]),
        makeCell([{ type: 'square', size: 0.55, color: '#34d399' }, { type: 'diamond', size: 0.45, color: '#fbbf24' }]),

        makeCell([{ type: 'ring', size: 0.65, color: '#a78bfa' }]),
        makeCell([{ type: 'star', size: 0.45, color: '#38bdf8' }]),
        makeCell([], true),
      ],
      options: {
        A: makeCell([{ type: 'ring', size: 0.65, color: '#a78bfa' }]),
        B: makeCell([{ type: 'star', size: 0.45, color: '#38bdf8' }]),
        C: makeCell([{ type: 'ring', size: 0.65, color: '#a78bfa' }, { type: 'star', size: 0.45, color: '#38bdf8' }]),
        D: makeCell([{ type: 'circle', size: 0.65, color: '#a78bfa' }, { type: 'cross', size: 0.45, color: '#38bdf8' }]),
      },
    } as MatrixPattern,
    options: [
      { id: 'A', label: 'Tylko pierścień' },
      { id: 'B', label: 'Tylko gwiazda' },
      { id: 'C', label: 'Pierścień i gwiazda' },
      { id: 'D', label: 'Koło i krzyż' },
    ],
    correctOptionId: 'C',
  },

  // --- 8. MEDIUM (D=2, tBase=40s) - Clockwise corner orbit of dot
  {
    id: 'q8',
    index: 8,
    difficulty: 2,
    tBase: 40,
    category: 'spatial_relations',
    ruleDescription: 'Kropka wędruje po czterech rogach komórki zgodnie z ruchem wskazówek zegara.',
    matrixData: {
      id: 'p8',
      name: 'Orbita narożna',
      description: 'Ruch punktu po rogach kwadratu',
      grid: [
        makeCell([{ type: 'square', size: 0.7, color: '#334155' }, { type: 'dots', size: 0.15, offsetX: -0.22, offsetY: -0.22, color: '#38bdf8' }]),
        makeCell([{ type: 'square', size: 0.7, color: '#334155' }, { type: 'dots', size: 0.15, offsetX: 0.22, offsetY: -0.22, color: '#38bdf8' }]),
        makeCell([{ type: 'square', size: 0.7, color: '#334155' }, { type: 'dots', size: 0.15, offsetX: 0.22, offsetY: 0.22, color: '#38bdf8' }]),

        makeCell([{ type: 'square', size: 0.7, color: '#334155' }, { type: 'dots', size: 0.15, offsetX: 0.22, offsetY: -0.22, color: '#f43f5e' }]),
        makeCell([{ type: 'square', size: 0.7, color: '#334155' }, { type: 'dots', size: 0.15, offsetX: 0.22, offsetY: 0.22, color: '#f43f5e' }]),
        makeCell([{ type: 'square', size: 0.7, color: '#334155' }, { type: 'dots', size: 0.15, offsetX: -0.22, offsetY: 0.22, color: '#f43f5e' }]),

        makeCell([{ type: 'square', size: 0.7, color: '#334155' }, { type: 'dots', size: 0.15, offsetX: 0.22, offsetY: 0.22, color: '#10b981' }]),
        makeCell([{ type: 'square', size: 0.7, color: '#334155' }, { type: 'dots', size: 0.15, offsetX: -0.22, offsetY: 0.22, color: '#10b981' }]),
        makeCell([], true),
      ],
      options: {
        A: makeCell([{ type: 'square', size: 0.7, color: '#334155' }, { type: 'dots', size: 0.15, offsetX: -0.22, offsetY: -0.22, color: '#10b981' }]),
        B: makeCell([{ type: 'square', size: 0.7, color: '#334155' }, { type: 'dots', size: 0.15, offsetX: 0.22, offsetY: 0.22, color: '#10b981' }]),
        C: makeCell([{ type: 'square', size: 0.7, color: '#334155' }, { type: 'dots', size: 0.15, offsetX: 0.22, offsetY: -0.22, color: '#10b981' }]),
        D: makeCell([{ type: 'square', size: 0.7, color: '#334155' }, { type: 'dots', size: 0.15, offsetX: 0, offsetY: 0, color: '#10b981' }]),
      },
    } as MatrixPattern,
    options: [
      { id: 'A', label: 'Lewy górny róg' },
      { id: 'B', label: 'Prawy dolny róg' },
      { id: 'C', label: 'Prawy górny róg' },
      { id: 'D', label: 'Środek kwadratu' },
    ],
    correctOptionId: 'A',
  },

  // --- 9. MEDIUM (D=2, tBase=40s) - Dual 45° angle progression
  {
    id: 'q9',
    index: 9,
    difficulty: 2,
    tBase: 40,
    category: 'rotation',
    ruleDescription: 'Figura obraca się o +45° w każdym kroku, zachowując spójność geometryczną.',
    matrixData: {
      id: 'p9',
      name: 'Rotacja pod kątem 45°',
      description: 'Obrót rombu i linii o 45 stopni',
      grid: [
        makeCell([{ type: 'diamond', rotation: 0, size: 0.55, color: '#38bdf8' }]),
        makeCell([{ type: 'diamond', rotation: 45, size: 0.55, color: '#38bdf8' }]),
        makeCell([{ type: 'diamond', rotation: 90, size: 0.55, color: '#38bdf8' }]),

        makeCell([{ type: 'triangle', rotation: 0, size: 0.55, color: '#e879f9' }]),
        makeCell([{ type: 'triangle', rotation: 45, size: 0.55, color: '#e879f9' }]),
        makeCell([{ type: 'triangle', rotation: 90, size: 0.55, color: '#e879f9' }]),

        makeCell([{ type: 'cross', rotation: 0, size: 0.55, color: '#fb923c' }]),
        makeCell([{ type: 'cross', rotation: 45, size: 0.55, color: '#fb923c' }]),
        makeCell([], true),
      ],
      options: {
        A: makeCell([{ type: 'cross', rotation: 0, size: 0.55, color: '#fb923c' }]),
        B: makeCell([{ type: 'cross', rotation: 45, size: 0.55, color: '#fb923c' }]),
        C: makeCell([{ type: 'cross', rotation: 90, size: 0.55, color: '#fb923c' }]),
        D: makeCell([{ type: 'cross', rotation: 135, size: 0.55, color: '#fb923c' }]),
      },
    } as MatrixPattern,
    options: [
      { id: 'A', label: 'Krzyż pionowy (0°)' },
      { id: 'B', label: 'Krzyż skośny (45°)' },
      { id: 'C', label: 'Krzyż obrócony o 90°' },
      { id: 'D', label: 'Krzyż pod kątem 135°' },
    ],
    correctOptionId: 'C',
  },

  // --- 10. MEDIUM (D=2, tBase=40s) - Element Counting Arithmetic (Col 1 + Col 2 = Col 3)
  {
    id: 'q10',
    index: 10,
    difficulty: 2,
    tBase: 40,
    category: 'matrix_arithmetic',
    ruleDescription: 'Arytmetyka matrycowa: liczba elementów w 3 kolumnie równa się sumie z kolumny 1 i 2.',
    matrixData: {
      id: 'p10',
      name: 'Arytmetyka dyskretna',
      description: 'Suma elementów: A + B = C',
      grid: [
        makeCell([{ type: 'dots', count: 1, layout: 'horizontal', color: '#60a5fa' }]),
        makeCell([{ type: 'dots', count: 2, layout: 'horizontal', color: '#60a5fa' }]),
        makeCell([{ type: 'dots', count: 3, layout: 'horizontal', color: '#60a5fa' }]),

        makeCell([{ type: 'square', count: 2, layout: 'horizontal', size: 0.4, color: '#34d399' }]),
        makeCell([{ type: 'square', count: 2, layout: 'horizontal', size: 0.4, color: '#34d399' }]),
        makeCell([{ type: 'square', count: 4, layout: 'grid', size: 0.4, color: '#34d399' }]),

        makeCell([{ type: 'triangle', count: 2, layout: 'horizontal', size: 0.4, color: '#f472b6' }]),
        makeCell([{ type: 'triangle', count: 3, layout: 'horizontal', size: 0.4, color: '#f472b6' }]),
        makeCell([], true),
      ],
      options: {
        A: makeCell([{ type: 'triangle', count: 4, layout: 'grid', size: 0.4, color: '#f472b6' }]),
        B: makeCell([{ type: 'triangle', count: 5, layout: 'grid', size: 0.4, color: '#f472b6' }]),
        C: makeCell([{ type: 'triangle', count: 6, layout: 'grid', size: 0.4, color: '#f472b6' }]),
        D: makeCell([{ type: 'triangle', count: 3, layout: 'horizontal', size: 0.4, color: '#f472b6' }]),
      },
    } as MatrixPattern,
    options: [
      { id: 'A', label: '4 Trójkąty' },
      { id: 'B', label: '5 Trójkątów (2 + 3)' },
      { id: 'C', label: '6 Trójkątów' },
      { id: 'D', label: '3 Trójkąty' },
    ],
    correctOptionId: 'B',
  },

  // --- 11. MEDIUM (D=2, tBase=40s) - Permutation of 3 shapes across rows
  {
    id: 'q11',
    index: 11,
    difficulty: 2,
    tBase: 40,
    category: 'spatial_relations',
    ruleDescription: 'Każdy wiersz i kolumna zawiera dokładnie jedno koło, jeden kwadrat i jeden trójkąt (łacina/sudoku logiczne).',
    matrixData: {
      id: 'p11',
      name: 'Kwadrat łaciński kształtów',
      description: 'Permutacja 3 figur bez powtórzeń',
      grid: [
        makeCell([{ type: 'circle', size: 0.55, color: '#38bdf8' }]),
        makeCell([{ type: 'square', size: 0.5, color: '#a78bfa' }]),
        makeCell([{ type: 'triangle', size: 0.55, color: '#f59e0b' }]),

        makeCell([{ type: 'triangle', size: 0.55, color: '#f59e0b' }]),
        makeCell([{ type: 'circle', size: 0.55, color: '#38bdf8' }]),
        makeCell([{ type: 'square', size: 0.5, color: '#a78bfa' }]),

        makeCell([{ type: 'square', size: 0.5, color: '#a78bfa' }]),
        makeCell([{ type: 'triangle', size: 0.55, color: '#f59e0b' }]),
        makeCell([], true),
      ],
      options: {
        A: makeCell([{ type: 'square', size: 0.5, color: '#a78bfa' }]),
        B: makeCell([{ type: 'triangle', size: 0.55, color: '#f59e0b' }]),
        C: makeCell([{ type: 'circle', size: 0.55, color: '#38bdf8' }]),
        D: makeCell([{ type: 'diamond', size: 0.55, color: '#ec4899' }]),
      },
    } as MatrixPattern,
    options: [
      { id: 'A', label: 'Kwadrat' },
      { id: 'B', label: 'Trójkąt' },
      { id: 'C', label: 'Koło (Dopełnienie zestawu)' },
      { id: 'D', label: 'Romb' },
    ],
    correctOptionId: 'C',
  },

  // --- 12. MEDIUM (D=2, tBase=40s) - Inversion of Fill & Contour
  {
    id: 'q12',
    index: 12,
    difficulty: 2,
    tBase: 40,
    category: 'symmetry',
    ruleDescription: 'Inwersja stanu wypełnienia: figura zewnętrzna i wewnętrzna wymieniają się stylami wypełnienia.',
    matrixData: {
      id: 'p12',
      name: 'Inwersja komplementarna',
      description: 'Zamiana wypełnienia: zewnątrz <-> wewnątrz',
      grid: [
        makeCell([{ type: 'square', fill: 'solid', size: 0.7, color: '#3b82f6' }, { type: 'circle', fill: 'none', size: 0.35, color: '#090d16' }]),
        makeCell([{ type: 'square', fill: 'none', size: 0.7, color: '#3b82f6' }, { type: 'circle', fill: 'solid', size: 0.35, color: '#3b82f6' }]),
        makeCell([{ type: 'square', fill: 'semi', size: 0.7, color: '#3b82f6' }, { type: 'circle', fill: 'semi', size: 0.35, color: '#3b82f6' }]),

        makeCell([{ type: 'circle', fill: 'solid', size: 0.7, color: '#10b981' }, { type: 'diamond', fill: 'none', size: 0.35, color: '#090d16' }]),
        makeCell([{ type: 'circle', fill: 'none', size: 0.7, color: '#10b981' }, { type: 'diamond', fill: 'solid', size: 0.35, color: '#10b981' }]),
        makeCell([{ type: 'circle', fill: 'semi', size: 0.7, color: '#10b981' }, { type: 'diamond', fill: 'semi', size: 0.35, color: '#10b981' }]),

        makeCell([{ type: 'hexagon', fill: 'solid', size: 0.7, color: '#f59e0b' }, { type: 'star', fill: 'none', size: 0.35, color: '#090d16' }]),
        makeCell([{ type: 'hexagon', fill: 'none', size: 0.7, color: '#f59e0b' }, { type: 'star', fill: 'solid', size: 0.35, color: '#f59e0b' }]),
        makeCell([], true),
      ],
      options: {
        A: makeCell([{ type: 'hexagon', fill: 'solid', size: 0.7, color: '#f59e0b' }, { type: 'star', fill: 'solid', size: 0.35, color: '#f59e0b' }]),
        B: makeCell([{ type: 'hexagon', fill: 'semi', size: 0.7, color: '#f59e0b' }, { type: 'star', fill: 'semi', size: 0.35, color: '#f59e0b' }]),
        C: makeCell([{ type: 'hexagon', fill: 'none', size: 0.7, color: '#f59e0b' }, { type: 'star', fill: 'none', size: 0.35, color: '#f59e0b' }]),
        D: makeCell([{ type: 'circle', fill: 'semi', size: 0.7, color: '#10b981' }, { type: 'star', fill: 'semi', size: 0.35, color: '#f59e0b' }]),
      },
    } as MatrixPattern,
    options: [
      { id: 'A', label: 'Oba pełne' },
      { id: 'B', label: 'Oba półprzezroczyste (Stan C)' },
      { id: 'C', label: 'Oba puste kontury' },
      { id: 'D', label: 'Koło ze spadkiem' },
    ],
    correctOptionId: 'B',
  },

  // --- 13. MEDIUM (D=2, tBase=40s) - Reflection / Mirror Symmetry
  {
    id: 'q13',
    index: 13,
    difficulty: 2,
    tBase: 40,
    category: 'symmetry',
    ruleDescription: 'Odbicie lustrzane względem osi pionowej (strzałka odwraca się horyzontalnie).',
    matrixData: {
      id: 'p13',
      name: 'Symetria osiowa',
      description: 'Lustrzane odbicie na osi pionowej',
      grid: [
        makeCell([{ type: 'arrow', rotation: 90, size: 0.55, color: '#38bdf8' }]),
        makeCell([{ type: 'lines', rotation: 90, size: 0.5, color: '#64748b' }]),
        makeCell([{ type: 'arrow', rotation: 270, size: 0.55, color: '#38bdf8' }]),

        makeCell([{ type: 'triangle', rotation: 90, size: 0.55, color: '#a855f7' }]),
        makeCell([{ type: 'lines', rotation: 90, size: 0.5, color: '#64748b' }]),
        makeCell([{ type: 'triangle', rotation: 270, size: 0.55, color: '#a855f7' }]),

        makeCell([{ type: 'arc', rotation: 0, size: 0.55, color: '#06b6d4' }]),
        makeCell([{ type: 'lines', rotation: 90, size: 0.5, color: '#64748b' }]),
        makeCell([], true),
      ],
      options: {
        A: makeCell([{ type: 'arc', rotation: 180, size: 0.55, color: '#06b6d4' }]),
        B: makeCell([{ type: 'arc', rotation: 0, size: 0.55, color: '#06b6d4' }]),
        C: makeCell([{ type: 'arc', rotation: 90, size: 0.55, color: '#06b6d4' }]),
        D: makeCell([{ type: 'circle', size: 0.55, color: '#06b6d4' }]),
      },
    } as MatrixPattern,
    options: [
      { id: 'A', label: 'Łuk odwrócony o 180°' },
      { id: 'B', label: 'Łuk pierwotny (0°)' },
      { id: 'C', label: 'Łuk boczny (90°)' },
      { id: 'D', label: 'Pełne koło' },
    ],
    correctOptionId: 'A',
  },

  // --- 14. MEDIUM (D=2, tBase=40s) - Cyclic Horizontal Shift of 3 items
  {
    id: 'q14',
    index: 14,
    difficulty: 2,
    tBase: 40,
    category: 'spatial_relations',
    ruleDescription: 'Trzy figury przesuwają się cyklicznie w prawo w każdym kolejnym wierszu (wiersz n+1 to shift wiersza n).',
    matrixData: {
      id: 'p14',
      name: 'Cykliczne przesunięcie fazowe',
      description: 'Rotacja kolejności [Kwadrat, Koło, Krzyż]',
      grid: [
        makeCell([{ type: 'square', size: 0.5, color: '#38bdf8' }]),
        makeCell([{ type: 'circle', size: 0.5, color: '#f43f5e' }]),
        makeCell([{ type: 'cross', size: 0.5, color: '#10b981' }]),

        makeCell([{ type: 'cross', size: 0.5, color: '#10b981' }]),
        makeCell([{ type: 'square', size: 0.5, color: '#38bdf8' }]),
        makeCell([{ type: 'circle', size: 0.5, color: '#f43f5e' }]),

        makeCell([{ type: 'circle', size: 0.5, color: '#f43f5e' }]),
        makeCell([{ type: 'cross', size: 0.5, color: '#10b981' }]),
        makeCell([], true),
      ],
      options: {
        A: makeCell([{ type: 'cross', size: 0.5, color: '#10b981' }]),
        B: makeCell([{ type: 'circle', size: 0.5, color: '#f43f5e' }]),
        C: makeCell([{ type: 'square', size: 0.5, color: '#38bdf8' }]),
        D: makeCell([{ type: 'diamond', size: 0.5, color: '#fbbf24' }]),
      },
    } as MatrixPattern,
    options: [
      { id: 'A', label: 'Krzyż' },
      { id: 'B', label: 'Koło' },
      { id: 'C', label: 'Kwadrat' },
      { id: 'D', label: 'Romb' },
    ],
    correctOptionId: 'C',
  },

  // --- 15. HARD (D=3, tBase=70s) - Boolean Exclusive-OR (XOR Logic) on Sub-segments
  {
    id: 'q15',
    index: 15,
    difficulty: 3,
    tBase: 70,
    category: 'boolean_logic',
    ruleDescription: 'Operacja logiczna XOR: elementy wspólne dla kolumny 1 i 2 znikają, a unikalne pozostają w kolumnie 3.',
    matrixData: {
      id: 'p15',
      name: 'Rachunek logiczny XOR',
      description: 'Wspólne elementy ulegają anihilacji',
      grid: [
        makeCell([{ type: 'circle', size: 0.6, color: '#38bdf8' }, { type: 'cross', size: 0.45, color: '#f472b6' }]),
        makeCell([{ type: 'cross', size: 0.45, color: '#f472b6' }, { type: 'dots', size: 0.15, color: '#fbbf24' }]),
        makeCell([{ type: 'circle', size: 0.6, color: '#38bdf8' }, { type: 'dots', size: 0.15, color: '#fbbf24' }]),

        makeCell([{ type: 'square', size: 0.6, color: '#34d399' }, { type: 'diamond', size: 0.4, color: '#e879f9' }]),
        makeCell([{ type: 'diamond', size: 0.4, color: '#e879f9' }, { type: 'lines', size: 0.4, color: '#38bdf8' }]),
        makeCell([{ type: 'square', size: 0.6, color: '#34d399' }, { type: 'lines', size: 0.4, color: '#38bdf8' }]),

        makeCell([{ type: 'hexagon', size: 0.65, color: '#fb923c' }, { type: 'star', size: 0.4, color: '#818cf8' }]),
        makeCell([{ type: 'star', size: 0.4, color: '#818cf8' }, { type: 'ring', size: 0.35, color: '#34d399' }]),
        makeCell([], true),
      ],
      options: {
        A: makeCell([{ type: 'hexagon', size: 0.65, color: '#fb923c' }, { type: 'star', size: 0.4, color: '#818cf8' }, { type: 'ring', size: 0.35, color: '#34d399' }]),
        B: makeCell([{ type: 'hexagon', size: 0.65, color: '#fb923c' }, { type: 'ring', size: 0.35, color: '#34d399' }]),
        C: makeCell([{ type: 'star', size: 0.4, color: '#818cf8' }]),
        D: makeCell([{ type: 'hexagon', size: 0.65, color: '#fb923c' }]),
      },
    } as MatrixPattern,
    options: [
      { id: 'A', label: 'Wszystkie 3 figury' },
      { id: 'B', label: 'Sześciokąt i pierścień (Gwiazda zredukowana przez XOR)' },
      { id: 'C', label: 'Tylko gwiazda' },
      { id: 'D', label: 'Tylko sześciokąt' },
    ],
    correctOptionId: 'B',
  },

  // --- 16. HARD (D=3, tBase=70s) - Compound 2-Axis Vector Transformation
  {
    id: 'q16',
    index: 16,
    difficulty: 3,
    tBase: 70,
    category: 'rotation',
    ruleDescription: 'Złożona dwuosiowa transformacja: poziomo obrót o +90°, pionowo inwersja koloru i zmiana wielkości.',
    matrixData: {
      id: 'p16',
      name: 'Złożony wektor transformacji',
      description: 'Sprzężony obrót i zmiana skali',
      grid: [
        makeCell([{ type: 'triangle', rotation: 0, size: 0.4, color: '#38bdf8' }]),
        makeCell([{ type: 'triangle', rotation: 90, size: 0.4, color: '#38bdf8' }]),
        makeCell([{ type: 'triangle', rotation: 180, size: 0.4, color: '#38bdf8' }]),

        makeCell([{ type: 'triangle', rotation: 90, size: 0.55, color: '#a78bfa' }]),
        makeCell([{ type: 'triangle', rotation: 180, size: 0.55, color: '#a78bfa' }]),
        makeCell([{ type: 'triangle', rotation: 270, size: 0.55, color: '#a78bfa' }]),

        makeCell([{ type: 'triangle', rotation: 180, size: 0.7, color: '#ec4899' }]),
        makeCell([{ type: 'triangle', rotation: 270, size: 0.7, color: '#ec4899' }]),
        makeCell([], true),
      ],
      options: {
        A: makeCell([{ type: 'triangle', rotation: 0, size: 0.7, color: '#ec4899' }]),
        B: makeCell([{ type: 'triangle', rotation: 90, size: 0.7, color: '#ec4899' }]),
        C: makeCell([{ type: 'triangle', rotation: 180, size: 0.7, color: '#ec4899' }]),
        D: makeCell([{ type: 'triangle', rotation: 270, size: 0.55, color: '#a78bfa' }]),
      },
    } as MatrixPattern,
    options: [
      { id: 'A', label: 'Trójkąt obrócony do góry (0° / 360°)' },
      { id: 'B', label: 'Trójkąt w prawo (90°)' },
      { id: 'C', label: 'Trójkąt w dół (180°)' },
      { id: 'D', label: 'Średni trójkąt' },
    ],
    correctOptionId: 'A',
  },

  // --- 17. HARD (D=3, tBase=70s) - Harmonic Orbital Mechanics (2:1 Ratio)
  {
    id: 'q17',
    index: 17,
    difficulty: 3,
    tBase: 70,
    category: 'spatial_relations',
    ruleDescription: 'Dwa satelity: zewnętrzny porusza się o 90° na krok, a wewnętrzny o 180° (rezonans 2:1).',
    matrixData: {
      id: 'p17',
      name: 'Rezonans orbitalny 2:1',
      description: 'Zbieżność kątowa dwóch punktów',
      grid: [
        makeCell([{ type: 'ring', size: 0.7, color: '#334155' }, { type: 'dots', size: 0.12, offsetX: 0, offsetY: -0.28, color: '#38bdf8' }, { type: 'cross', size: 0.25, offsetX: 0, offsetY: 0.15, color: '#fbbf24' }]),
        makeCell([{ type: 'ring', size: 0.7, color: '#334155' }, { type: 'dots', size: 0.12, offsetX: 0.28, offsetY: 0, color: '#38bdf8' }, { type: 'cross', size: 0.25, offsetX: 0, offsetY: -0.15, color: '#fbbf24' }]),
        makeCell([{ type: 'ring', size: 0.7, color: '#334155' }, { type: 'dots', size: 0.12, offsetX: 0, offsetY: 0.28, color: '#38bdf8' }, { type: 'cross', size: 0.25, offsetX: 0, offsetY: 0.15, color: '#fbbf24' }]),

        makeCell([{ type: 'ring', size: 0.7, color: '#334155' }, { type: 'dots', size: 0.12, offsetX: 0.28, offsetY: 0, color: '#38bdf8' }, { type: 'cross', size: 0.25, offsetX: 0, offsetY: -0.15, color: '#fbbf24' }]),
        makeCell([{ type: 'ring', size: 0.7, color: '#334155' }, { type: 'dots', size: 0.12, offsetX: 0, offsetY: 0.28, color: '#38bdf8' }, { type: 'cross', size: 0.25, offsetX: 0, offsetY: 0.15, color: '#fbbf24' }]),
        makeCell([{ type: 'ring', size: 0.7, color: '#334155' }, { type: 'dots', size: 0.12, offsetX: -0.28, offsetY: 0, color: '#38bdf8' }, { type: 'cross', size: 0.25, offsetX: 0, offsetY: -0.15, color: '#fbbf24' }]),

        makeCell([{ type: 'ring', size: 0.7, color: '#334155' }, { type: 'dots', size: 0.12, offsetX: 0, offsetY: 0.28, color: '#38bdf8' }, { type: 'cross', size: 0.25, offsetX: 0, offsetY: 0.15, color: '#fbbf24' }]),
        makeCell([{ type: 'ring', size: 0.7, color: '#334155' }, { type: 'dots', size: 0.12, offsetX: -0.28, offsetY: 0, color: '#38bdf8' }, { type: 'cross', size: 0.25, offsetX: 0, offsetY: -0.15, color: '#fbbf24' }]),
        makeCell([], true),
      ],
      options: {
        A: makeCell([{ type: 'ring', size: 0.7, color: '#334155' }, { type: 'dots', size: 0.12, offsetX: 0, offsetY: -0.28, color: '#38bdf8' }, { type: 'cross', size: 0.25, offsetX: 0, offsetY: 0.15, color: '#fbbf24' }]),
        B: makeCell([{ type: 'ring', size: 0.7, color: '#334155' }, { type: 'dots', size: 0.12, offsetX: 0.28, offsetY: 0, color: '#38bdf8' }, { type: 'cross', size: 0.25, offsetX: 0, offsetY: 0.15, color: '#fbbf24' }]),
        C: makeCell([{ type: 'ring', size: 0.7, color: '#334155' }, { type: 'dots', size: 0.12, offsetX: 0, offsetY: -0.28, color: '#38bdf8' }, { type: 'cross', size: 0.25, offsetX: 0, offsetY: -0.15, color: '#fbbf24' }]),
        D: makeCell([{ type: 'ring', size: 0.7, color: '#334155' }, { type: 'dots', size: 0.12, offsetX: -0.28, offsetY: 0, color: '#38bdf8' }, { type: 'cross', size: 0.25, offsetX: 0, offsetY: 0.15, color: '#fbbf24' }]),
      },
    } as MatrixPattern,
    options: [
      { id: 'A', label: 'Kropka góra (0°) + Krzyż dół' },
      { id: 'B', label: 'Kropka prawo + Krzyż dół' },
      { id: 'C', label: 'Kropka góra + Krzyż góra' },
      { id: 'D', label: 'Kropka lewo + Krzyż dół' },
    ],
    correctOptionId: 'A',
  },

  // --- 18. HARD (D=3, tBase=70s) - Multi-Layer Topological Invariance (Number of Enclosed Spaces)
  {
    id: 'q18',
    index: 18,
    difficulty: 3,
    tBase: 70,
    category: 'matrix_arithmetic',
    ruleDescription: 'Topologiczna liczba odizolowanych regionów (oczek): wiersz 1 ma 1, wiersz 2 ma 2, wiersz 3 ma 3 regiony.',
    matrixData: {
      id: 'p18',
      name: 'Niezmiennik topologiczny',
      description: 'Liczba zamkniętych obszarów wewnętrznych',
      grid: [
        makeCell([{ type: 'circle', fill: 'none', size: 0.6, color: '#38bdf8' }]),
        makeCell([{ type: 'square', fill: 'none', size: 0.55, color: '#38bdf8' }]),
        makeCell([{ type: 'triangle', fill: 'none', size: 0.6, color: '#38bdf8' }]),

        makeCell([{ type: 'ring', fill: 'none', size: 0.65, color: '#34d399' }]),
        makeCell([{ type: 'square', fill: 'none', size: 0.65, color: '#34d399' }, { type: 'lines', rotation: 0, size: 0.65, color: '#34d399' }]),
        makeCell([{ type: 'circle', fill: 'none', size: 0.65, color: '#34d399' }, { type: 'lines', rotation: 90, size: 0.65, color: '#34d399' }]),

        makeCell([{ type: 'ring', size: 0.7, color: '#f43f5e' }, { type: 'lines', rotation: 0, size: 0.7, color: '#f43f5e' }]),
        makeCell([{ type: 'square', size: 0.65, color: '#f43f5e' }, { type: 'cross', size: 0.65, color: '#f43f5e' }]),
        makeCell([], true),
      ],
      options: {
        A: makeCell([{ type: 'circle', size: 0.7, color: '#f43f5e' }, { type: 'cross', size: 0.7, color: '#f43f5e' }]),
        B: makeCell([{ type: 'circle', fill: 'none', size: 0.6, color: '#f43f5e' }]),
        C: makeCell([{ type: 'square', fill: 'none', size: 0.55, color: '#f43f5e' }]),
        D: makeCell([{ type: 'lines', size: 0.6, color: '#f43f5e' }]),
      },
    } as MatrixPattern,
    options: [
      { id: 'A', label: 'Koło z krzyżem dzielącym na 4 sektory' },
      { id: 'B', label: 'Pojedyncze koło (1 region)' },
      { id: 'C', label: 'Pojedynczy kwadrat' },
      { id: 'D', label: 'Otwarte linie' },
    ],
    correctOptionId: 'A',
  },

  // --- 19. HARD (D=3, tBase=70s) - Polarity Cancellation (Dark + Light = Empty)
  {
    id: 'q19',
    index: 19,
    difficulty: 3,
    tBase: 70,
    category: 'boolean_logic',
    ruleDescription: 'Biegunowość przeciwna: pełna figura (dodatnia) w zetknięciu z konturem (ujemną) znosi się, dając pustą komórkę.',
    matrixData: {
      id: 'p19',
      name: 'Anihilacja polaryzacyjna',
      description: 'Znoszenie ładunku graficznego: + i - daje zero',
      grid: [
        makeCell([{ type: 'circle', fill: 'solid', size: 0.6, color: '#38bdf8' }]),
        makeCell([{ type: 'circle', fill: 'none', size: 0.6, color: '#38bdf8' }]),
        makeCell([]), // Empty result

        makeCell([{ type: 'square', fill: 'solid', size: 0.55, color: '#a855f7' }]),
        makeCell([{ type: 'square', fill: 'none', size: 0.55, color: '#a855f7' }]),
        makeCell([]), // Empty result

        makeCell([{ type: 'diamond', fill: 'solid', size: 0.6, color: '#fbbf24' }]),
        makeCell([{ type: 'diamond', fill: 'none', size: 0.6, color: '#fbbf24' }]),
        makeCell([], true),
      ],
      options: {
        A: makeCell([{ type: 'diamond', fill: 'solid', size: 0.6, color: '#fbbf24' }]),
        B: makeCell([{ type: 'diamond', fill: 'none', size: 0.6, color: '#fbbf24' }]),
        C: makeCell([]), // Pusta komórka (anihilacja)
        D: makeCell([{ type: 'circle', fill: 'solid', size: 0.6, color: '#fbbf24' }]),
      },
    } as MatrixPattern,
    options: [
      { id: 'A', label: 'Pełny romb' },
      { id: 'B', label: 'Kontur rombu' },
      { id: 'C', label: 'Puste pole (Pełna anihilacja)' },
      { id: 'D', label: 'Pełne koło' },
    ],
    correctOptionId: 'C',
  },

  // --- 20. HARD (D=3, tBase=70s) - Multi-Transform Symmetry & Center Inversion
  {
    id: 'q20',
    index: 20,
    difficulty: 3,
    tBase: 70,
    category: 'symmetry',
    ruleDescription: 'Centralna inwersja punktowa macierzy 3x3: komórka (3,3) jest punktowym obrotem o 180° komórki (1,1).',
    matrixData: {
      id: 'p20',
      name: 'Punktowa inwersja centralna',
      description: 'Symetria środkowa względem centrum matrycy',
      grid: [
        makeCell([{ type: 'triangle', rotation: 45, size: 0.5, color: '#38bdf8' }, { type: 'dots', offsetX: 0.2, offsetY: 0.2, size: 0.15, color: '#f43f5e' }]),
        makeCell([{ type: 'cross', rotation: 0, size: 0.5, color: '#a855f7' }]),
        makeCell([{ type: 'triangle', rotation: 135, size: 0.5, color: '#38bdf8' }, { type: 'dots', offsetX: -0.2, offsetY: 0.2, size: 0.15, color: '#f43f5e' }]),

        makeCell([{ type: 'lines', rotation: 0, size: 0.55, color: '#10b981' }]),
        makeCell([{ type: 'ring', size: 0.6, color: '#e2e8f0' }]), // Punkt centralny
        makeCell([{ type: 'lines', rotation: 90, size: 0.55, color: '#10b981' }]),

        makeCell([{ type: 'triangle', rotation: 315, size: 0.5, color: '#38bdf8' }, { type: 'dots', offsetX: 0.2, offsetY: -0.2, size: 0.15, color: '#f43f5e' }]),
        makeCell([{ type: 'cross', rotation: 45, size: 0.5, color: '#a855f7' }]),
        makeCell([], true),
      ],
      options: {
        A: makeCell([{ type: 'triangle', rotation: 225, size: 0.5, color: '#38bdf8' }, { type: 'dots', offsetX: -0.2, offsetY: -0.2, size: 0.15, color: '#f43f5e' }]),
        B: makeCell([{ type: 'triangle', rotation: 45, size: 0.5, color: '#38bdf8' }, { type: 'dots', offsetX: 0.2, offsetY: 0.2, size: 0.15, color: '#f43f5e' }]),
        C: makeCell([{ type: 'cross', rotation: 0, size: 0.5, color: '#a855f7' }]),
        D: makeCell([{ type: 'ring', size: 0.6, color: '#e2e8f0' }]),
      },
    } as MatrixPattern,
    options: [
      { id: 'A', label: 'Trójkąt (225°) + Kropka lewy-górny (Inwersja punktowa 180°)' },
      { id: 'B', label: 'Trójkąt (45°) + Kropka prawy-dolny' },
      { id: 'C', label: 'Krzyż prosty' },
      { id: 'D', label: 'Pierścień' },
    ],
    correctOptionId: 'A',
  },
];
