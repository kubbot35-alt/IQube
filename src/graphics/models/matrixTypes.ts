/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PrimitiveShape =
  | 'circle'
  | 'square'
  | 'triangle'
  | 'diamond'
  | 'cross'
  | 'ring'
  | 'star'
  | 'arrow'
  | 'dots'
  | 'lines'
  | 'arc'
  | 'hexagon';

export type FillStyle = 'none' | 'solid' | 'striped' | 'dotted' | 'semi';

export interface ShapeDescriptor {
  type: PrimitiveShape;
  size?: number; // 0.1 to 0.9 normalized
  rotation?: number; // degrees
  fill?: FillStyle;
  strokeWidth?: number;
  count?: number; // e.g. 1 to 5 items
  offsetX?: number; // -0.5 to 0.5
  offsetY?: number;
  color?: string; // default subtle cyan/indigo/slate
  secondaryType?: PrimitiveShape;
  layout?: 'centered' | 'horizontal' | 'vertical' | 'radial' | 'grid' | 'corners';
}

export interface MatrixCell {
  isMissing?: boolean;
  shapes: ShapeDescriptor[];
}

export interface MatrixPattern {
  id: string;
  name: string;
  description: string;
  grid: MatrixCell[]; // 9 cells (index 0..8). Index 8 is isMissing: true
  options: {
    A: MatrixCell;
    B: MatrixCell;
    C: MatrixCell;
    D: MatrixCell;
  };
}
