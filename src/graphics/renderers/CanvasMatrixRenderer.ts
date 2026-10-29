/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IQuestionRenderer, RenderOptions } from '../interfaces/IQuestionRenderer';
import { FillStyle, MatrixCell, MatrixPattern, PrimitiveShape, ShapeDescriptor } from '../models/matrixTypes';

export class CanvasMatrixRenderer implements IQuestionRenderer {
  /**
   * Renders the complete 3x3 matrix onto the main canvas with HiDPI support.
   */
  public renderMatrix(
    canvas: HTMLCanvasElement,
    pattern: MatrixPattern,
    options?: RenderOptions
  ): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this.setupCanvasDpi(canvas, ctx);
    const width = canvas.clientWidth || 360;
    const height = canvas.clientHeight || 360;

    // Clear background
    ctx.clearRect(0, 0, width, height);

    // Dark sleek background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, width, height);

    const padding = 12;
    const gap = 8;
    const availableW = width - padding * 2 - gap * 2;
    const availableH = height - padding * 2 - gap * 2;
    const cellSize = Math.min(availableW / 3, availableH / 3);

    const startX = (width - (cellSize * 3 + gap * 2)) / 2;
    const startY = (height - (cellSize * 3 + gap * 2)) / 2;

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const index = r * 3 + c;
        const x = startX + c * (cellSize + gap);
        const y = startY + r * (cellSize + gap);

        const cell = pattern.grid[index];
        const isTargetMissing = index === 8 || Boolean(cell?.isMissing);

        this.drawCellBox(ctx, x, y, cellSize, isTargetMissing);

        if (isTargetMissing) {
          this.drawMissingQuestionMark(ctx, x, y, cellSize);
        } else if (cell) {
          ctx.save();
          ctx.beginPath();
          ctx.rect(x + 2, y + 2, cellSize - 4, cellSize - 4);
          ctx.clip();
          this.drawShapesInBox(ctx, cell.shapes, x, y, cellSize);
          ctx.restore();
        }
      }
    }
  }

  /**
   * Renders a single cell into an answer option preview canvas.
   */
  public renderCell(
    canvas: HTMLCanvasElement,
    cell: MatrixCell,
    options?: RenderOptions
  ): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this.setupCanvasDpi(canvas, ctx);
    const width = canvas.clientWidth || 100;
    const height = canvas.clientHeight || 100;

    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    const size = Math.min(width, height);
    const x = (width - size) / 2;
    const y = (height - size) / 2;

    ctx.save();
    ctx.beginPath();
    ctx.rect(x + 2, y + 2, size - 4, size - 4);
    ctx.clip();
    this.drawShapesInBox(ctx, cell.shapes, x, y, size);
    ctx.restore();
  }

  private setupCanvasDpi(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const displayWidth = canvas.clientWidth || canvas.width;
    const displayHeight = canvas.clientHeight || canvas.height;

    if (canvas.width !== Math.round(displayWidth * dpr) || canvas.height !== Math.round(displayHeight * dpr)) {
      canvas.width = Math.round(displayWidth * dpr);
      canvas.height = Math.round(displayHeight * dpr);
    }
    ctx.resetTransform();
    ctx.scale(dpr, dpr);
  }

  private drawCellBox(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    isMissing: boolean
  ): void {
    const radius = 6;
    ctx.beginPath();
    ctx.roundRect(x, y, size, size, radius);

    if (isMissing) {
      ctx.fillStyle = '#111827';
      ctx.fill();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.setLineDash([]);
    } else {
      ctx.fillStyle = '#0f172a';
      ctx.fill();
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  private drawMissingQuestionMark(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number
  ): void {
    ctx.save();
    ctx.fillStyle = '#818cf8';
    ctx.font = `600 ${Math.round(size * 0.38)}px 'Plus Jakarta Sans', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('?', x + size / 2, y + size / 2);
    ctx.restore();
  }

  private drawShapesInBox(
    ctx: CanvasRenderingContext2D,
    shapes: ShapeDescriptor[],
    x: number,
    y: number,
    boxSize: number
  ): void {
    const centerX = x + boxSize / 2;
    const centerY = y + boxSize / 2;

    shapes.forEach((shape) => {
      ctx.save();

      const normalizedSize = (shape.size ?? 0.6) * (boxSize * 0.85);
      const posX = centerX + (shape.offsetX ?? 0) * boxSize;
      const posY = centerY + (shape.offsetY ?? 0) * boxSize;
      const count = shape.count ?? 1;
      const layout = shape.layout ?? 'centered';

      ctx.translate(posX, posY);
      if (shape.rotation) {
        ctx.rotate((shape.rotation * Math.PI) / 180);
      }

      const strokeColor = shape.color || '#e2e8f0';
      const fillStyle = shape.fill || 'none';

      if (count > 1 && layout !== 'centered') {
        this.renderMultiLayout(ctx, shape, count, layout, normalizedSize, strokeColor, fillStyle);
      } else {
        this.renderSingleShape(ctx, shape.type, normalizedSize, strokeColor, fillStyle);
      }

      ctx.restore();
    });
  }

  private renderMultiLayout(
    ctx: CanvasRenderingContext2D,
    shape: ShapeDescriptor,
    count: number,
    layout: string,
    totalSpan: number,
    strokeColor: string,
    fillStyle: FillStyle
  ): void {
    const subSize = totalSpan / (count > 3 ? 2.5 : 2.0);

    if (layout === 'horizontal') {
      const step = totalSpan / (count + 1);
      const startX = -totalSpan / 2 + step;
      for (let i = 0; i < count; i++) {
        ctx.save();
        ctx.translate(startX + i * step, 0);
        this.renderSingleShape(ctx, shape.type, subSize, strokeColor, fillStyle);
        ctx.restore();
      }
    } else if (layout === 'vertical') {
      const step = totalSpan / (count + 1);
      const startY = -totalSpan / 2 + step;
      for (let i = 0; i < count; i++) {
        ctx.save();
        ctx.translate(0, startY + i * step);
        this.renderSingleShape(ctx, shape.type, subSize, strokeColor, fillStyle);
        ctx.restore();
      }
    } else if (layout === 'radial') {
      const radius = totalSpan * 0.35;
      for (let i = 0; i < count; i++) {
        const angle = (i * 2 * Math.PI) / count;
        ctx.save();
        ctx.translate(Math.cos(angle) * radius, Math.sin(angle) * radius);
        this.renderSingleShape(ctx, shape.type, subSize * 0.8, strokeColor, fillStyle);
        ctx.restore();
      }
    } else if (layout === 'grid') {
      const cols = Math.ceil(Math.sqrt(count));
      const rows = Math.ceil(count / cols);
      const cellSpan = totalSpan / cols;
      let drawn = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (drawn >= count) break;
          const px = (c - (cols - 1) / 2) * cellSpan;
          const py = (r - (rows - 1) / 2) * cellSpan;
          ctx.save();
          ctx.translate(px, py);
          this.renderSingleShape(ctx, shape.type, cellSpan * 0.65, strokeColor, fillStyle);
          ctx.restore();
          drawn++;
        }
      }
    } else {
      this.renderSingleShape(ctx, shape.type, totalSpan, strokeColor, fillStyle);
    }
  }

  private renderSingleShape(
    ctx: CanvasRenderingContext2D,
    type: PrimitiveShape,
    size: number,
    color: string,
    fill: FillStyle
  ): void {
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(1.5, size * 0.04);
    ctx.fillStyle = color;

    switch (type) {
      case 'circle': {
        const r = size / 2;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        this.applyFillAndStroke(ctx, fill, color, size);
        break;
      }
      case 'ring': {
        const rOut = size / 2;
        const rIn = rOut * 0.55;
        ctx.beginPath();
        ctx.arc(0, 0, rOut, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, rIn, 0, Math.PI * 2);
        ctx.stroke();
        break;
      }
      case 'square': {
        const half = size / 2;
        ctx.beginPath();
        ctx.rect(-half, -half, size, size);
        this.applyFillAndStroke(ctx, fill, color, size);
        break;
      }
      case 'triangle': {
        const h = (size * Math.sqrt(3)) / 2;
        ctx.beginPath();
        ctx.moveTo(0, -h / 2);
        ctx.lineTo(size / 2, h / 2);
        ctx.lineTo(-size / 2, h / 2);
        ctx.closePath();
        this.applyFillAndStroke(ctx, fill, color, size);
        break;
      }
      case 'diamond': {
        const half = size / 2;
        ctx.beginPath();
        ctx.moveTo(0, -half);
        ctx.lineTo(half, 0);
        ctx.lineTo(0, half);
        ctx.lineTo(-half, 0);
        ctx.closePath();
        this.applyFillAndStroke(ctx, fill, color, size);
        break;
      }
      case 'cross': {
        const half = size / 2;
        const arm = size * 0.22;
        ctx.beginPath();
        ctx.moveTo(-arm / 2, -half);
        ctx.lineTo(arm / 2, -half);
        ctx.lineTo(arm / 2, -arm / 2);
        ctx.lineTo(half, -arm / 2);
        ctx.lineTo(half, arm / 2);
        ctx.lineTo(arm / 2, arm / 2);
        ctx.lineTo(arm / 2, half);
        ctx.lineTo(-arm / 2, half);
        ctx.lineTo(-arm / 2, arm / 2);
        ctx.lineTo(-half, arm / 2);
        ctx.lineTo(-half, -arm / 2);
        ctx.lineTo(-arm / 2, -arm / 2);
        ctx.closePath();
        this.applyFillAndStroke(ctx, fill, color, size);
        break;
      }
      case 'hexagon': {
        const r = size / 2;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (i * Math.PI) / 3;
          const px = r * Math.cos(a);
          const py = r * Math.sin(a);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        this.applyFillAndStroke(ctx, fill, color, size);
        break;
      }
      case 'star': {
        const rOut = size / 2;
        const rIn = rOut * 0.45;
        ctx.beginPath();
        for (let i = 0; i < 10; i++) {
          const r = i % 2 === 0 ? rOut : rIn;
          const a = (i * Math.PI) / 5 - Math.PI / 2;
          const px = r * Math.cos(a);
          const py = r * Math.sin(a);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        this.applyFillAndStroke(ctx, fill, color, size);
        break;
      }
      case 'arrow': {
        const half = size / 2;
        ctx.beginPath();
        ctx.moveTo(0, -half);
        ctx.lineTo(half * 0.7, 0);
        ctx.lineTo(half * 0.25, 0);
        ctx.lineTo(half * 0.25, half);
        ctx.lineTo(-half * 0.25, half);
        ctx.lineTo(-half * 0.25, 0);
        ctx.lineTo(-half * 0.7, 0);
        ctx.closePath();
        this.applyFillAndStroke(ctx, fill, color, size);
        break;
      }
      case 'lines': {
        const half = size / 2;
        ctx.beginPath();
        ctx.moveTo(-half, -half * 0.5);
        ctx.lineTo(half, -half * 0.5);
        ctx.moveTo(-half, 0);
        ctx.lineTo(half, 0);
        ctx.moveTo(-half, half * 0.5);
        ctx.lineTo(half, half * 0.5);
        ctx.stroke();
        break;
      }
      case 'dots': {
        const r = Math.max(2, size * 0.12);
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        break;
      }
      case 'arc': {
        const r = size / 2;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI);
        ctx.stroke();
        break;
      }
    }
  }

  private applyFillAndStroke(
    ctx: CanvasRenderingContext2D,
    fill: FillStyle,
    color: string,
    size: number
  ): void {
    if (fill === 'solid') {
      ctx.fillStyle = color;
      ctx.fill();
    } else if (fill === 'semi') {
      ctx.fillStyle = color.startsWith('#') ? color + '44' : 'rgba(129, 140, 248, 0.25)';
      ctx.fill();
      ctx.stroke();
    } else if (fill === 'striped') {
      ctx.save();
      ctx.clip();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      const step = Math.max(4, size * 0.15);
      for (let i = -size; i < size * 2; i += step) {
        ctx.beginPath();
        ctx.moveTo(i, -size);
        ctx.lineTo(i + size, size);
        ctx.stroke();
      }
      ctx.restore();
      ctx.stroke();
    } else {
      ctx.stroke();
    }
  }
}
