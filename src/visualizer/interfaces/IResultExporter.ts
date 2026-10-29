/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IQScoreResult } from '../../core/models/types';

export interface ExportCardOptions {
  userName?: string;
  watermark?: boolean;
}

export interface IResultExporter {
  generateCardBlob(result: IQScoreResult, options?: ExportCardOptions): Promise<Blob>;
  downloadCard(result: IQScoreResult, options?: ExportCardOptions): Promise<void>;
}
