import type { Driver, DriverInput } from './base';
import { textDriver } from './text';
import { structuredDriver } from './structured';
import { toolMultiDriver, toolSingleDriver } from './tools';

export function createDriver(input: DriverInput): Driver {
  switch (input.ctx.transport) {
    case 'prefill':
    case 'plaintext': return textDriver(input);
    case 'structured': return structuredDriver(input);
    case 'tool-single': return toolSingleDriver(input);
    case 'tool-multi': return toolMultiDriver(input);
  }
}
export type { Driver, DriverInput, CallerInfo } from './base';
