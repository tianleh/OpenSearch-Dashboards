import './index.scss';

import { CspStorageProviderPlugin } from './plugin';

// This exports static code and TypeScript types,
// as well as, OpenSearch Dashboards Platform `plugin()` initializer.
export function plugin() {
  return new CspStorageProviderPlugin();
}
export { CspStorageProviderPluginSetup, CspStorageProviderPluginStart } from './types';
