import type { ConfigContext, ExpoConfig } from 'expo/config';

// app.json holds the configuration. Two build-time overrides are read from the environment:
//   EXPO_BASE_URL       serve the web build from a sub-path (GitHub Pages: /palm-reader)
//   LUNARA_BUILD_NUMBER positive integer used as Android versionCode and iOS buildNumber, so every
//                       release build uploaded to the stores gets a higher number
export default ({ config }: ConfigContext): ExpoConfig => {
  const baseUrl = process.env.EXPO_BASE_URL;
  const build = Number(process.env.LUNARA_BUILD_NUMBER);
  const hasBuild = Number.isInteger(build) && build > 0;
  return {
    ...(config as ExpoConfig),
    experiments: { ...config.experiments, ...(baseUrl ? { baseUrl } : {}) },
    ...(hasBuild
      ? {
          android: { ...config.android, versionCode: build },
          ios: { ...config.ios, buildNumber: String(build) },
        }
      : {}),
  };
};
