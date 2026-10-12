// Config plugin: signs Android release builds with your own upload key when these environment
// variables are set at build time, and otherwise keeps Expo's default (debug key, fine for
// sideloading but not accepted by Google Play):
//   LUNARA_UPLOAD_STORE_FILE      absolute path to the .jks/.keystore file
//   LUNARA_UPLOAD_STORE_PASSWORD  keystore password
//   LUNARA_UPLOAD_KEY_ALIAS       key alias
//   LUNARA_UPLOAD_KEY_PASSWORD    key password
// Nothing secret is written into the generated project; values are read from the environment.
const { withAppBuildGradle } = require('expo/config-plugins');

const RELEASE_SIGNING = `signingConfigs {
        release {
            if (System.getenv('LUNARA_UPLOAD_STORE_FILE')) {
                storeFile file(System.getenv('LUNARA_UPLOAD_STORE_FILE'))
                storePassword System.getenv('LUNARA_UPLOAD_STORE_PASSWORD')
                keyAlias System.getenv('LUNARA_UPLOAD_KEY_ALIAS')
                keyPassword System.getenv('LUNARA_UPLOAD_KEY_PASSWORD')
            }
        }
`;

function applyReleaseSigning(contents) {
  if (contents.includes('LUNARA_UPLOAD_STORE_FILE')) return contents;
  const withConfig = contents.replace(/signingConfigs \{\n/, RELEASE_SIGNING);
  const withBuildType = withConfig.replace(
    /(buildTypes \{[\s\S]*?release \{\n(?:\s*\/\/.*\n)*\s*)signingConfig signingConfigs\.debug/,
    "$1signingConfig System.getenv('LUNARA_UPLOAD_STORE_FILE') ? signingConfigs.release : signingConfigs.debug",
  );
  if (withConfig === contents || withBuildType === withConfig) {
    throw new Error('withReleaseSigning: android/app/build.gradle has an unexpected shape; update the plugin.');
  }
  return withBuildType;
}

module.exports = function withReleaseSigning(config) {
  return withAppBuildGradle(config, (cfg) => {
    cfg.modResults.contents = applyReleaseSigning(cfg.modResults.contents);
    return cfg;
  });
};
module.exports.applyReleaseSigning = applyReleaseSigning;
