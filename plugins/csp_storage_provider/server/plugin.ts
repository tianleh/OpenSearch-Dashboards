import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Plugin,
  Logger,
} from '../../../src/core/server';

import { CspStorageProviderPluginSetup, CspStorageProviderPluginStart } from './types';
import { defineRoutes } from './routes';

export class CspStorageProviderPlugin
  implements Plugin<CspStorageProviderPluginSetup, CspStorageProviderPluginStart> {
  private readonly logger: Logger;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get();
  }

  public setup(core: CoreSetup, { indexManagementDashboards }: AppPluginSetupDependencies) {
    this.logger.debug('CspStorageProvider: Setup');
    const router = core.http.createRouter();

    // Register server side APIs
    defineRoutes(router);

    return {};
  }

  public start(core: CoreStart) {
    this.logger.debug('CspStorageProvider: Started');
    return {};
  }

  public stop() { }
}
