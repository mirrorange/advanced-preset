/** Debug ring buffers for the panel's debug tab (assembly snapshots, request segments, warnings). */
import { reactive } from 'vue';

export interface DebugEntry { kind: string; at: number; data: unknown }
export interface RequestRecord {
  genId: string;
  step: number;
  at: number;
  durationMs?: number;
  request: unknown;
  response?: string;
  error?: string;
  usage?: unknown;
}

export const debugState = reactive({
  log: [] as DebugEntry[],
  requests: [] as RequestRecord[],
});

const MAX = 50;

export function debugLog(kind: string, data: unknown): void {
  debugState.log.unshift({ kind, at: Date.now(), data });
  if (debugState.log.length > MAX) debugState.log.length = MAX;
}

export function recordRequest(r: RequestRecord): RequestRecord {
  debugState.requests.unshift(r);
  if (debugState.requests.length > MAX) debugState.requests.length = MAX;
  return debugState.requests[0]!;
}
