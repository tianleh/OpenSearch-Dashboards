import {
  HttpConfig,
  IRouter,
  OpenSearchDashboardsRequest,
  OpenSearchDashboardsResponseFactory,
  RouteConfig,
} from 'src/core/server/http';
import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Plugin,
  Logger,
  IClusterClient,
  OnPreResponseHandler,
  HttpResources,
  HttpResourcesRequestHandler,
  RequestHandlerContext,
  HttpResourcesServiceToolkit,
  HttpResourcesRenderOptions,
  OpenSearchClient,
} from '../../../core/server';

import { CspClient, XframeOptionsPluginSetup, XframeOptionsPluginStart } from './types';
import { defineRoutes } from './routes';
import { OpenSearchCspClient } from './provider';

const OPENSEARCH_DASHBOARDS_CONFIG_INDEX_NAME = '.opensearch_dashboards_config';
const OPENSEARCH_DASHBOARDS_CONFIG_DOCUMENT_NAME = 'csp.rules';

export class XframeOptionsPlugin
  implements Plugin<XframeOptionsPluginSetup, XframeOptionsPluginStart> {
  private readonly logger: Logger;

  private cspClient: CspClient | undefined;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get();
    this.cspClient = undefined;
  }

  private setCspClient(inputCspClient: CspClient) {
    console.log('***** set the configured cspClient');

    this.cspClient = inputCspClient;
  }

  private getCspClient(inputOpenSearchClient: OpenSearchClient) {
    this.logger.info('***** getCspClient');
    if (this.cspClient) {
      this.logger.info('***** use the configured cspClient');
      return this.cspClient;
    }

    this.logger.info('***** use the default open search cspClient');
    return new OpenSearchCspClient(inputOpenSearchClient);
  }

  public async setup(core: CoreSetup) {
    this.logger.debug('XFrameOptions: Setup');
    const router = core.http.createRouter();

    // Register server side APIs
    defineRoutes(router);

    // const [coreStart] = await core.getStartServices();

    // const client = coreStart.opensearch.client;
    this.logger.info(
      `** inside the current rules ${core.http.csp.rules}, **** ${core.http.csp.header}`
    );

    core.http.registerOnPreResponse(this.createXFrameOptionsPreResponseHandler(core));

    // const [coreStart] = await core.getStartServices();

    // const data = await coreStart.opensearch.client.asInternalUser.cat
    //   .indices<any[]>({
    //     index: ".kibana",
    //     format: 'JSON',
    //     bytes: 'b',
    //   });

    // this.logger.info("**** data is " + JSON.stringify(data));

    return {
      // createRegistrar: this.createRegistrar.bind(this, core),
      setCspClient: this.setCspClient.bind(this),
    };
  }

  public async start(core: CoreStart) {
    this.logger.debug('XFrameOptions: Started');
    this.logger.info('XFrameOptions: Started');

    // const client = core.opensearch.client.asInternalUser;
    // const exists = await client.indices.exists({
    //   index: OPENSEARCH_DASHBOARDS_CONFIG_INDEX_NAME,
    // });
    // const myClient = this.getCspClient(core.opensearch.client.asInternalUser);
    // const myClient = new OpenSearchCspClient(core.opensearch.client.asInternalUser);
    // const existsResult = await myClient.exists(OPENSEARCH_DASHBOARDS_CONFIG_INDEX_NAME);

    // this.logger.info('***** exists: ' + existsResult + ' ' + typeof existsResult);

    // if (!existsResult) {
    //   this.logger.info('***** going to create index');

    //   // create index
    //   // const createResponse = await client.indices.create({
    //   //   index: OPENSEARCH_DASHBOARDS_CONFIG_INDEX_NAME
    //   // });

    //   const indexResponse = await myClient.update(
    //     OPENSEARCH_DASHBOARDS_CONFIG_INDEX_NAME,
    //     OPENSEARCH_DASHBOARDS_CONFIG_DOCUMENT_NAME,
    //     {
    //       value: "frame-ancestors 'self'",
    //     }
    //   );

    //   // const indexResponse = await client.index({
    //   //   index: OPENSEARCH_DASHBOARDS_CONFIG_INDEX_NAME,
    //   //   id: 'csp.rules',
    //   //   body: {
    //   //     value: "frame-ancestors 'self'",
    //   //   },
    //   // });

    //   this.logger.info('***** createResponse: ' + JSON.stringify(indexResponse));
    // }

    return {};
  }

  public stop() {}

  public createXFrameOptionsPreResponseHandler(core: CoreSetup): OnPreResponseHandler {
    console.log('*** createXFrameOptionsPreResponseHandler is called');

    // const serverName = config.name;
    // const customHeaders = config.customResponseHeaders;

    // console.log("**** the initial customHeaders are " + JSON.stringify(customHeaders));

    return async (request, response, toolkit) => {
      console.log('*** inside createXFrameOptionsPreResponseHandler is called');
      console.log(
        '*** inside createXFrameOptionsPreResponseHandler is request.url ' +
          JSON.stringify(request.url)
      );

      console.log(
        '*** inside createXFrameOptionsPreResponseHandler is request all ' +
          JSON.stringify(request.body) +
          JSON.stringify(request.headers) +
          JSON.stringify(request.id) +
          JSON.stringify(request.isSystemRequest) +
          JSON.stringify(request.params) +
          JSON.stringify(request.query) +
          '***' +
          JSON.stringify(request.route.method) +
          JSON.stringify(request.route.options) +
          'abcd*' +
          JSON.stringify(request.route.path)
      );

      const shouldCheck = ['document', 'frame', 'iframe', 'embed', 'object'];
      // const shouldCheck = ['document', 'frame', 'iframe'];
      const fetchDest = request.headers['sec-fetch-dest'];
      if (!shouldCheck.includes(fetchDest)) {
        console.log('***** non document request, skipping');
        return toolkit.next({});
      }

      console.log('***** document request, verifying');

      // const exclude = /(\.(js)|(svg)|(json)|(png)|(css)|(woff2))$/;

      // if (exclude.test(request.url.toString())) {
      //   // skip
      //   return toolkit.next({});
      // }

      // response.statusCode;
      const [coreStart] = await core.getStartServices();

      // const opensearchClient: ILegacyClusterClient = coreSetup.opensearch.legacy.createClient("xframeoptions");
      // core.getStartServices();
      // console.log("***** client is " + client);
      // console.log("*** type of request " + typeof (request));

      // const myClient = new OpenSearchCspClient(coreStart.opensearch.client.asInternalUser);
      const myClient = this.getCspClient(coreStart.opensearch.client.asInternalUser);

      const existsData = await myClient.exists(OPENSEARCH_DASHBOARDS_CONFIG_INDEX_NAME);
      // if (myClient.exists(OPENSEARCH_DASHBOARDS_CONFIG_INDEX_NAME)) {

      // }
      let head;
      const defaultValue = core.http.csp.header;
      if (!existsData) {
        head = defaultValue;

        console.log('*** return a default value');
      } else {
        const data = await myClient.search(OPENSEARCH_DASHBOARDS_CONFIG_INDEX_NAME, 'csp.rules');
        // const data = await this.getXFrameOptions(client);

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
        // console.log('**** request.headers are ' + JSON.stringify(request.headers));

        head = data || defaultValue;
      }

      console.log('*** going to set head as ' + head);
      const additionalHeaders = {
        // ...customHeaders,
        // ['content-security-policy']: "form-action 'self'; frame-ancestors 'https://maps.googleapis.com'",
        ['content-security-policy']: head,
      };

      console.log(
        '**** inside createXFrameOptionsPreResponseHandler the additionalHeaders customHeaders are ' +
          JSON.stringify(additionalHeaders)
      );

      return toolkit.next({ headers: additionalHeaders });
    };
  }

  // private async getXFrameOptions(client: IClusterClient) {
  //   // Search for the document.
  //   const query = {
  //     query: {
  //       match: {
  //         _id: {
  //           query: 'csp.rules',
  //         },
  //       },
  //     },
  //   };

  //   const data = await client.asInternalUser.search({
  //     index: OPENSEARCH_DASHBOARDS_CONFIG_INDEX_NAME,
  //     // scroll: SCROLL_TIMEOUT,
  //     // size: SCROLL_SIZE,
  //     _source: true,
  //     body: query,
  //     rest_total_hits_as_int: true, // not declared on SearchParams type
  //   });

  //   // console.log('******* raw index is ' + JSON.stringify(data));

  //   console.log('******* raw index is ' + JSON.stringify(data.body.hits.hits));

  //   return data.body.hits.hits[0]?._source.value;
  // }
}
