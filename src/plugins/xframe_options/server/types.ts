// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface XframeOptionsPluginSetup {
  setCspClient: (inputCspClient: CspClient) => void;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface XframeOptionsPluginStart {}

export interface CspClient {
  exists(indexName: string): Promise<boolean>;

  update(indexName: string, docName: string, body: {}): Promise<string>;

  search(indexName: string, docName: string): Promise<string>;
}
