/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IQScoreResult } from '../../core/models/types';
import { ExportCardOptions, IResultExporter } from '../interfaces/IResultExporter';

export class ResultCardExporter implements IResultExporter {
  public async generateCardBlob(
    result: IQScoreResult,
    options?: ExportCardOptions
  ): Promise<Blob> {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 675; // 16:9 ratio

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Nie można utworzyć kontekstu Canvas 2D.');
    }

    this.drawCard(ctx, canvas.width, canvas.height, result, options);

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Błąd generowania pliku PNG.'));
      }, 'image/png');
    });
  }

  public async downloadCard(
    result: IQScoreResult,
    options?: ExportCardOptions
  ): Promise<void> {
    const blob = await this.generateCardBlob(result, options);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `iqube-iq-${result.testId || 'result'}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  private drawCard(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    result: IQScoreResult,
    options?: ExportCardOptions
  ): void {
    // 1. Deep Obsidian Gradient Background
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, '#060913');
    bgGradient.addColorStop(0.5, '#0b1022');
    bgGradient.addColorStop(1, '#05070f');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // 2. Subtle Geometric Grid Lines
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.06)';
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 3. Double Inset Certificate Border
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.35)';
    ctx.lineWidth = 2;
    ctx.strokeRect(36, 36, width - 72, height - 72);

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.18)';
    ctx.lineWidth = 1;
    ctx.strokeRect(44, 44, width - 88, height - 88);

    // Decorative corner markers
    this.drawCornerAccents(ctx, 36, 36, width - 72, height - 72);

    // 4. Header: Brand & Certificate Title
    ctx.fillStyle = '#818cf8';
    ctx.font = '600 13px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('IQUBE PSYCHOMETRIC ASSESSMENT', 68, 86);

    ctx.fillStyle = '#64748b';
    ctx.font = '500 12px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';
    const dateStr = new Date(result.completionTimestamp || Date.now()).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    ctx.fillText(`ID: ${result.testId}  ·  DATA: ${dateStr}`, width - 68, 86);

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 24px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Oficjalny Raport Badania Inteligencji Płynnej', 68, 126);

    // 5. Hero Score Block
    const heroBoxY = 160;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(68, heroBoxY, width - 136, 160, 12);
    ctx.fill();
    ctx.stroke();

    // Large IQ Number
    ctx.fillStyle = '#38bdf8';
    ctx.font = '800 68px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`${result.iqScore}`, 100, heroBoxY + 86);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('ILORAZ INTELIGENCJI (SKALA WAIS / WECHSLER)', 100, heroBoxY + 124);

    // Vertical Divider inside Hero
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.moveTo(380, heroBoxY + 24);
    ctx.lineTo(380, heroBoxY + 136);
    ctx.stroke();

    // Classification & Percentile
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(result.classification, 415, heroBoxY + 68);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '600 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(
      `Wynik wyższy niż ${result.percentile}% populacji ogólnej (Centyl: ${result.percentile}%)`,
      415,
      heroBoxY + 102
    );

    ctx.fillStyle = '#64748b';
    ctx.font = '400 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Parametryzacja normalna: średnia μ = 100, odchylenie standardowe σ = 15', 415, heroBoxY + 128);

    // 6. Metrics Grid: 4 Analytic Cards
    const gridY = 340;
    const cardW = (width - 136 - 36) / 3;
    const cardH = 92;

    const metrics = [
      {
        label: 'Trafność odpowiedzi',
        val: `${result.correctCount} / ${result.totalQuestions}`,
        sub: `Współczynnik: ${result.accuracyPercentage}%`,
      },
      {
        label: 'Średni czas reakcji',
        val: `${result.averageTimeSeconds}s`,
        sub: `Całkowity czas: ${Math.round(result.totalTimeSeconds)}s`,
      },
      {
        label: 'Bonus poznawczy (t < t_base)',
        val: `+${result.speedBonusAccumulated.toFixed(2)} pkt`,
        sub: `Kompensacja automatyzmu: ${result.speedBonusAccumulated > 0 ? 'Aktywna' : '0'}`,
      },
    ];

    metrics.forEach((m, idx) => {
      const cx = 68 + idx * (cardW + 18);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.5)';
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.5)';
      ctx.beginPath();
      ctx.roundRect(cx, gridY, cardW, cardH, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '500 12px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(m.label, cx + 18, gridY + 28);

      ctx.fillStyle = '#ffffff';
      ctx.font = '700 20px "JetBrains Mono", monospace';
      ctx.fillText(m.val, cx + 18, gridY + 56);

      ctx.fillStyle = '#64748b';
      ctx.font = '400 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(m.sub, cx + 18, gridY + 76);
    });

    // 7. Mini Gaussian Curve Graphic at Bottom
    this.drawMiniGaussianCurve(ctx, 68, 455, width - 136, 120, result.iqScore);

    // 8. Footer Authority Stamp & Watermark
    ctx.fillStyle = '#475569';
    ctx.font = '500 11px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('METRIC STANDARD: RAVEN PROGRESSIVE MATRICES · LATENCY-ADAPTIVE SCORE ENGINE', 68, 615);

    ctx.textAlign = 'right';
    ctx.fillText('ZWERYFIKOWANO PRZEZ IQUBE RUNTIME v1.0', width - 68, 615);
  }

  private drawMiniGaussianCurve(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    userIQ: number
  ): void {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 8);
    ctx.fill();
    ctx.stroke();

    const curveBaseY = y + h - 22;
    const curveHeight = h - 42;
    const muX = x + w / 2;
    const sigmaPx = w / 7;

    // Draw Gaussian Fill
    ctx.beginPath();
    ctx.moveTo(x + 20, curveBaseY);
    for (let px = x + 20; px <= x + w - 20; px += 4) {
      const z = (px - muX) / sigmaPx;
      const cy = curveBaseY - curveHeight * Math.exp(-(z * z) / 2);
      ctx.lineTo(px, cy);
    }
    ctx.lineTo(x + w - 20, curveBaseY);
    ctx.closePath();

    const fillGrad = ctx.createLinearGradient(0, y, 0, curveBaseY);
    fillGrad.addColorStop(0, 'rgba(56, 189, 248, 0.25)');
    fillGrad.addColorStop(1, 'rgba(99, 102, 241, 0.02)');
    ctx.fillStyle = fillGrad;
    ctx.fill();

    // Draw Curve Stroke
    ctx.beginPath();
    for (let px = x + 20; px <= x + w - 20; px += 4) {
      const z = (px - muX) / sigmaPx;
      const cy = curveBaseY - curveHeight * Math.exp(-(z * z) / 2);
      if (px === x + 20) ctx.moveTo(px, cy);
      else ctx.lineTo(px, cy);
    }
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.stroke();

    // User Position Marker
    const userZ = (userIQ - 100) / 15;
    const userMarkerX = Math.min(x + w - 30, Math.max(x + 30, muX + userZ * sigmaPx));
    const userMarkerY = curveBaseY - curveHeight * Math.exp(-(userZ * userZ) / 2);

    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(userMarkerX, curveBaseY);
    ctx.lineTo(userMarkerX, userMarkerY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Glow dot
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(userMarkerX, userMarkerY, 5, 0, Math.PI * 2);
    ctx.fill();

    // Label on curve
    ctx.fillStyle = '#f43f5e';
    ctx.font = '600 11px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`Twój wynik: IQ ${userIQ}`, userMarkerX, userMarkerY - 8);
  }

  private drawCornerAccents(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number
  ): void {
    const len = 14;
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;

    // Top Left
    ctx.beginPath();
    ctx.moveTo(x, y + len);
    ctx.lineTo(x, y);
    ctx.lineTo(x + len, y);
    ctx.stroke();

    // Top Right
    ctx.beginPath();
    ctx.moveTo(x + w - len, y);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w, y + len);
    ctx.stroke();

    // Bottom Left
    ctx.beginPath();
    ctx.moveTo(x, y + h - len);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x + len, y + h);
    ctx.stroke();

    // Bottom Right
    ctx.beginPath();
    ctx.moveTo(x + w - len, y + h);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x + w, y + h - len);
    ctx.stroke();
  }
}
