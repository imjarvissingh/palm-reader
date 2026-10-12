// eslint-disable-next-line @typescript-eslint/no-require-imports
const { applyReleaseSigning } = require('../plugins/withReleaseSigning') as { applyReleaseSigning: (s: string) => string };

const TEMPLATE = `android {
    signingConfigs {
        debug {
            storeFile file('debug.keystore')
        }
    }
    buildTypes {
        debug {
            signingConfig signingConfigs.debug
        }
        release {
            // Caution! In production, you need to generate your own keystore file.
            signingConfig signingConfigs.debug
            minifyEnabled false
        }
    }
}`;

describe('withReleaseSigning', () => {
  it('uses the upload key for release builds only when one is provided', () => {
    const out = applyReleaseSigning(TEMPLATE);
    expect(out).toContain("storeFile file(System.getenv('LUNARA_UPLOAD_STORE_FILE'))");
    expect(out).toContain("signingConfig System.getenv('LUNARA_UPLOAD_STORE_FILE') ? signingConfigs.release : signingConfigs.debug");
    // debug builds keep the debug key
    expect(out.match(/signingConfig signingConfigs\.debug\n/g)).toHaveLength(1);
  });

  it('is idempotent and never embeds secrets', () => {
    const once = applyReleaseSigning(TEMPLATE);
    expect(applyReleaseSigning(once)).toBe(once);
    expect(once).not.toMatch(/storePassword '/);
  });

  it('fails loudly if the generated project changes shape', () => {
    expect(() => applyReleaseSigning('android {}')).toThrow(/unexpected shape/);
  });
});
