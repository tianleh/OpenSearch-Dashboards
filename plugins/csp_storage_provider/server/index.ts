import { PluginInitializerContext } from '../../../src/core/server';
import { CspStorageProviderPlugin } from './plugin';

// This exports static code and TypeScript types,
// as well as, OpenSearch Dashboards Platform `plugin()` initializer.

export function plugin(initializerContext: PluginInitializerContext) {
  return new CspStorageProviderPlugin(initializerContext);
}

export { CspStorageProviderPluginSetup, CspStorageProviderPluginStart } from './types';
