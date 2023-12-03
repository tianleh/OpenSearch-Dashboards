import { HttpConfig } from 'src/core/server/http';
import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Plugin,
  Logger,
  IClusterClient,
  OnPreResponseHandler,
} from '../../../core/server';

import { XframeOptionsPluginSetup, XframeOptionsPluginStart } from './types';
import { defineRoutes } from './routes';

const SCROLL_SIZE = 10000;
const SCROLL_TIMEOUT = '1m';

export class XframeOptionsPlugin
  implements Plugin<XframeOptionsPluginSetup, XframeOptionsPluginStart> {
  private readonly logger: Logger;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get();
  }

  public async setup(core: CoreSetup) {
    this.logger.debug('XFrameOptions: Setup');
    const router = core.http.createRouter();

    // Register server side APIs
    defineRoutes(router);

    // const [coreStart] = await core.getStartServices();

    // const client = coreStart.opensearch.client;
    core.http.registerOnPreResponse(this.createXFrameOptionsPreResponseHandler(core));

    // const [coreStart] = await core.getStartServices();

    // const data = await coreStart.opensearch.client.asInternalUser.cat
    //   .indices<any[]>({
    //     index: ".kibana",
    //     format: 'JSON',
    //     bytes: 'b',
    //   });

    // this.logger.info("**** data is " + JSON.stringify(data));

    return {};
  }

  public start(core: CoreStart) {
    this.logger.debug('XFrameOptions: Started');
    return {};
  }

  public stop() {}

  public createXFrameOptionsPreResponseHandler(core: CoreSetup): OnPreResponseHandler {
    console.log('*** createXFrameOptionsPreResponseHandler is called');

    // const serverName = config.name;
    // const customHeaders = config.customResponseHeaders;

    // console.log("**** the initial customHeaders are " + JSON.stringify(customHeaders));

    return async (request, response, toolkit) => {
      console.log('*** inside createCustomHeadersPreResponseHandler is called');
      console.log(
        '*** inside createCustomHeadersPreResponseHandler is headers ' +
          JSON.stringify(request.headers)
      );

      const [coreStart] = await core.getStartServices();

      const client = coreStart.opensearch.client;

      // const opensearchClient: ILegacyClusterClient = coreSetup.opensearch.legacy.createClient("xframeoptions");
      // core.getStartServices();
      // console.log("***** client is " + client);
      // console.log("*** type of request " + typeof (request));

      const data = await this.getXFrameOptions(client);
      // const data = await client.asInternalUser.cat
      //   .indices<any[]>({
      //     index: ".kibana",
      //     format: 'JSON',
      //     bytes: 'b',
      //   });

      console.log('******* getXFrameOptions is ' + data);

      // const esResponse = await opensearchClient
      //   .asScoped(request)
      //   .callAsCurrentUser('cat', {
      //     index: ".kibana"
      //   });

      // console.log("**** esResponse " + JSON.stringify(esResponse));
      // try to call system index here.
      // const data = context.core.opensearch.client.asCurrentUser.ping();

      // console.log("*******" + JSON.stringify(data));
      console.log('**** request.headers are ' + JSON.stringify(request.headers));

      const additionalHeaders = {
        // ...customHeaders,
        ['x-frame-options']: data,
      };

      console.log(
        '**** inside createXFrameOptionsPreResponseHandler the additionalHeaders customHeaders are ' +
          JSON.stringify(additionalHeaders)
      );

      return toolkit.next({ headers: additionalHeaders });
    };
  }

  private async getXFrameOptions(client: IClusterClient) {
    // Search for the document.
    const query = {
      query: {
        match: {
          type: {
            query: 'config',
          },
        },
      },
    };

    const data = await client.asInternalUser.search({
      index: '.kibana',
      scroll: SCROLL_TIMEOUT,
      size: SCROLL_SIZE,
      _source: true,
      body: query,
      rest_total_hits_as_int: true, // not declared on SearchParams type
    });

    console.log('******* raw index is ' + JSON.stringify(data));

    console.log('******* raw index is ' + JSON.stringify(data.body.hits.hits));

    return data.body.hits.hits[0]?._source.config?.xFrameOptions;
  }
}
