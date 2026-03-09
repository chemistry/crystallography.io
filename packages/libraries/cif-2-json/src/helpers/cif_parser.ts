import type { CifDataBlock } from '../types.js';
import { cifProcessDataLine } from './cif_process_data_line.js';
import { cifProcessLoop } from './cif_process_loop.js';

const LOOP_START = /^(\s*)loop_(\s*)$/i;

export function cifParser(lines: string[]): CifDataBlock {
  lines.reverse();

  const result: CifDataBlock = {};

  while (lines.length > 0) {
    const line = lines[lines.length - 1];

    if (line.length > 1 && line.startsWith('_')) {
      const dataLine = cifProcessDataLine(lines);
      for (const key of Object.keys(dataLine)) {
        result[key] = dataLine[key];
      }
      continue;
    }

    if (
      lines.length > 2 &&
      (line.startsWith('loop_') || line.startsWith('lOOP_')) &&
      LOOP_START.exec(line)
    ) {
      lines.pop();
      const loopData = cifProcessLoop(lines);
      if (loopData) {
        result.loop_ = result.loop_ || [];
        result.loop_.push(loopData);
      }

      continue;
    }

    lines.pop();
  }

  return result;
}
