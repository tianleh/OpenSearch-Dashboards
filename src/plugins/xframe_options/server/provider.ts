import { OpenSearchClient } from 'src/core/server';
import { CspClient } from './types';

const SCROLL_SIZE = 10000;
const SCROLL_TIMEOUT = '1m';
const OPENSEARCH_DASHBOARDS_CONFIG_INDEX_NAME = '.opensearch_dashboards_config';

export interface CspClientsProvider {
  getClient(): CspClient;
}

export class OpenSearchCspClient implements CspClient {
  client: OpenSearchClient | undefined;

  constructor(inputOpenSearchClient: OpenSearchClient) {
    this.client = inputOpenSearchClient;
  }

  async exists(indexName: string): Promise<boolean> {
    const exists = await this.client.indices.exists({
      index: indexName,
    });

    return exists.body;
  }

  // async update(indexName: string, docName: string, body: {}): Promise<string> {
  //   const indexResponse = await this.client.index({
  //     index: indexName,
  //     id: docName,
  //     body,
  //   });

  //   return JSON.stringify(indexResponse);
  // }

  async search(indexName: string, docName: string): Promise<string> {
    const query = {
      query: {
        match: {
          _id: {
            query: 'csp.rules',
          },
        },
      },
    };

    const data = await this.client.search({
      index: indexName,
      scroll: SCROLL_TIMEOUT,
      size: SCROLL_SIZE,
      _source: true,
      body: query,
      rest_total_hits_as_int: true, // not declared on SearchParams type
    });

    // console.log('******* raw index is ' + JSON.stringify(data));

    console.log('******* raw index is ' + JSON.stringify(data.body.hits.hits));

    return data.body.hits.hits[0]?._source.value;
  }
}
