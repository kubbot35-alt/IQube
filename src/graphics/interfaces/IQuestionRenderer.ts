/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MatrixCell, MatrixPattern } from '../models/matrixTypes';

export interface RenderOptions {
  theme?: 'dark' | 'light';
  highlightMissing?: boolean;
  activeCellIndex?: number | null;
}

export interface IQuestionRenderer {
  renderMatrix(
    canvas: HTMLCanvasElement,
    pattern: MatrixPattern,
    options?: RenderOptions
  ): void;

  renderCell(
    canvas: HTMLCanvasElement,
    cell: MatrixCell,
    options?: RenderOptions
  ): void;
}
