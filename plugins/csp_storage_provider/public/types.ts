import { NavigationPublicPluginStart } from '../../../src/plugins/navigation/public';

export interface CspStorageProviderPluginSetup {
  getGreeting: () => string;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CspStorageProviderPluginStart {}

export interface AppPluginStartDependencies {
  navigation: NavigationPublicPluginStart;
}
