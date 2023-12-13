import { XframeOptionsPluginSetup } from '../../../src/plugins/xframe_options/server';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CspStorageProviderPluginSetup { }
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CspStorageProviderPluginStart { }

export interface AppPluginSetupDependencies {
    xframeOptions: XframeOptionsPluginSetup;
}