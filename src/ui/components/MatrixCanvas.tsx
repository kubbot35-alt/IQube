/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { CanvasMatrixRenderer } from '../../graphics/renderers/CanvasMatrixRenderer';
import { MatrixPattern } from '../../graphics/models/matrixTypes';

interface MatrixCanvasProps {
  pattern: MatrixPattern;
  renderer: CanvasMatrixRenderer;
}

export const MatrixCanvas: React.FC<MatrixCanvasProps> = ({ pattern, renderer }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    renderer.renderMatrix(canvas, pattern);

    const handleResize = () => {
      if (canvasRef.current) {
        renderer.renderMatrix(canvasRef.current, pattern);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [pattern, renderer]);

  return (
    <div className="w-full flex flex-col items-center justify-center p-3 sm:p-5 bg-slate-900/60 border border-slate-800 rounded-xl shadow-2xl">
      <div className="w-full max-w-[400px] aspect-square relative">
        <canvas
          ref={canvasRef}
          className="w-full h-full block rounded-lg cursor-default select-none shadow-inner"
        />
      </div>
      <p className="mt-3 text-xs text-slate-400 text-center font-normal">
        Wskaż brakujący element oznaczony znakiem zapytania w prawym dolnym rogu.
      </p>
    </div>
  );
};
