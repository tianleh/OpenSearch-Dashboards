import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Plugin,
  Logger,
} from '../../../src/core/server';

import { AppPluginSetupDependencies, CspStorageProviderPluginSetup, CspStorageProviderPluginStart } from './types';
import { defineRoutes } from './routes';
import { CspClient } from 'src/plugins/xframe_options/server/types';

export class MyClient implements CspClient {
  async exists(indexName: string): Promise<boolean> {
    console.log(`*** MyClient receive exists call ${indexName}`);
    // throw new Error('Method not implemented.');
    return false;
  }

  async update(indexName: string, docName: string, body: {}): Promise<string> {

    console.log(`*** MyClient receive update request ${indexName}, ${docName}, ${body}`);
    return "sucess";
    // throw new Error('Method not implemented.');
  }

  async search(indexName: string, docName: string): Promise<string> {
    console.log(`*** MyClient receive update request ${indexName}, ${docName}`);

    // throw new Error('Method not implemented.');
    return "frame-ancestors 'self' file://* filesystem:";
  }

}

export class CspStorageProviderPlugin
  implements Plugin<CspStorageProviderPluginSetup, CspStorageProviderPluginStart> {
  private readonly logger: Logger;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get();
  }

  private createClient(): CspClient {
    return new MyClient();
  }

  public setup(core: CoreSetup, { xframeOptions }: AppPluginSetupDependencies) {
    this.logger.debug('CspStorageProvider: Setup');
    this.logger.info('CspStorageProvider: Setup');

    const router = core.http.createRouter();

    // console.log("*** xframeOptions" + xframeOptions);
    const customClient = this.createClient();

    if (customClient) {
      this.logger.info('CspStorageProvider: Setup customClient is valid');
    } else {
      this.logger.info('CspStorageProvider: Setup customClient is invalid');
    }

    // xframeOptions.setCspClient(customClient);
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
