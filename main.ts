/**
 * Fix Human Sleep: Funniest Patch Note — make.fun entry.
 *
 * Writes a single line of patch notes announcing that human sleep has
 * been fixed to /output/entry.txt. The line itself lives in entry.txt
 * next to this file, so the shipped text and the written text are the
 * same bytes; this program only validates it (one line, 1-160 chars)
 * and copies it to the grader's output path.
 */

import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_CHARS = 160;
const OUTPUT_PATH =
  process.env.ENTRY_OUTPUT ?? "/output/entry.txt";

function main(): number {
  const here = dirname(fileURLToPath(import.meta.url));
  const line = readFileSync(join(here, "entry.txt"), "utf-8").trim();
  if (!line) {
    console.error("refusing to write a blank entry");
    return 1;
  }
  if (line.includes("\n")) {
    console.error("entry must be a single line");
    return 1;
  }
  if (line.length > MAX_CHARS) {
    console.error(
      `entry is ${line.length} chars, over the ${MAX_CHARS} limit`,
    );
    return 1;
  }
  // No control characters, finished sentence.
  for (const ch of line) {
    if (ch.charCodeAt(0) < 0x20 || ch.charCodeAt(0) === 0x7f) {
      console.error("entry must not contain control characters");
      return 1;
    }
  }
  if (!/[.!?]$/.test(line)) {
    console.error("entry must end with terminal punctuation");
    return 1;
  }
  const target = resolve(OUTPUT_PATH);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, line, "utf-8");
  console.log(`wrote ${line.length} chars to ${target}`);
  return 0;
}

process.exit(main());
