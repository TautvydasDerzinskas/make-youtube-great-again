/**
 * Prepares the self-distributed Firefox build next to the addons.mozilla.org one, so the add-on
 * stays installable (signed, from GitHub releases) even without the store listing.
 *
 * Mozilla signs a version only once per add-on, so this build has its own add-on ID and is signed
 * on the "unlisted" channel (automatically, no store listing). It updates from updates.json in the
 * repository instead of from the store.
 *
 * Usage: node .github/scripts/firefox-self-distributed.mjs <version>
 * Reads dist/firefox, writes dist/firefox-self-distributed & updates.json
 */
import { cpSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Never change it once a build is signed: Firefox treats versions with another ID as another add-on
const ADDON_ID = 'myga@tautvydas.info';
const REPOSITORY = 'TautvydasDerzinskas/make-youtube-great-again';
const UPDATE_MANIFEST_URL = `https://raw.githubusercontent.com/${REPOSITORY}/main/updates.json`;

const version = process.argv[2];
if (!/^\d+\.\d+\.\d+$/.test(version || '')) {
  console.error('Usage: node .github/scripts/firefox-self-distributed.mjs <version>');
  process.exit(1);
}

const root = resolve(import.meta.dirname, '../..');
const source = resolve(root, 'dist/firefox');
const target = resolve(root, 'dist/firefox-self-distributed');

rmSync(target, { recursive: true, force: true });
cpSync(source, target, { recursive: true });

const manifestPath = resolve(target, 'manifest.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
if (manifest.version !== version) {
  throw new Error(`dist/firefox is version ${manifest.version}, expected ${version}: build it first`);
}
manifest.browser_specific_settings.gecko.id = ADDON_ID;
manifest.browser_specific_settings.gecko.update_url = UPDATE_MANIFEST_URL;
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

// Firefox's update manifest: installs of the self-distributed build look here for new versions
const updates = {
  addons: {
    [ADDON_ID]: {
      updates: [{
        version,
        update_link: `https://github.com/${REPOSITORY}/releases/download/v${version}/myga-firefox.xpi`,
      }],
    },
  },
};
writeFileSync(resolve(root, 'updates.json'), JSON.stringify(updates, null, 2) + '\n');

console.log(`Self-distributed Firefox build ${version} (${ADDON_ID}) in dist/firefox-self-distributed`);
