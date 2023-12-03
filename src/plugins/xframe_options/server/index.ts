import { PluginInitializerContext } from '../../../core/server';
import { XframeOptionsPlugin } from './plugin';

// This exports static code and TypeScript types,
// as well as, OpenSearch Dashboards Platform `plugin()` initializer.

export function plugin(initializerContext: PluginInitializerContext) {
  return new XframeOptionsPlugin(initializerContext);
}

export { XframeOptionsPluginSetup, XframeOptionsPluginStart } from './types';
