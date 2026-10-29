/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IQScoreResult } from '../../core/models/types';

export interface IResultVisualizer {
  mount(container: HTMLElement, result: IQScoreResult): void;
  unmount(): void;
  setViewMode(mode: 'gaussian' | 'neural' | 'combined'): void;
  toggleAutoRotate(enabled: boolean): void;
  resetCamera(): void;
}
