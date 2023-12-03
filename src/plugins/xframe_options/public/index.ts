import './index.scss';

import { XframeOptionsPlugin } from './plugin';

// This exports static code and TypeScript types,
// as well as, OpenSearch Dashboards Platform `plugin()` initializer.
export function plugin() {
  return new XframeOptionsPlugin();
}
export { XframeOptionsPluginSetup, XframeOptionsPluginStart } from './types';
