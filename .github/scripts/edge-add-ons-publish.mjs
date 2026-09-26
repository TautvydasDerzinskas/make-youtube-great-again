/**
 * Uploads myga-chrome.zip to Microsoft Edge Add-ons and submits it for review, published
 * automatically once approved. Uses the Edge Add-ons API v1.1, which only updates an existing
 * product: the first version is submitted in Partner Center.
 *
 * Usage: node .github/scripts/edge-add-ons-publish.mjs <version>
 * Env: EDGE_PRODUCT_ID, EDGE_CLIENT_ID, EDGE_API_KEY (Partner Center → Microsoft Edge → Publish API)
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const API = 'https://api.addons.microsoftedge.microsoft.com/v1';
const POLL_SECONDS = 5;
const TIMEOUT_SECONDS = 300;

const version = process.argv[2];
if (!/^\d+\.\d+\.\d+$/.test(version || '')) {
  console.error('Usage: node .github/scripts/edge-add-ons-publish.mjs <version>');
  process.exit(1);
}

const { EDGE_PRODUCT_ID, EDGE_CLIENT_ID, EDGE_API_KEY } = process.env;
// Optional until the Edge Add-ons product exists: without it the release skips Edge
if (!EDGE_PRODUCT_ID || !EDGE_CLIENT_ID || !EDGE_API_KEY) {
  console.log(`::warning::EDGE_PRODUCT_ID, EDGE_CLIENT_ID and EDGE_API_KEY are not set, ${version} was not uploaded to Edge Add-ons`);
  process.exit(0);
}

const root = resolve(import.meta.dirname, '../..');
const product = `${API}/products/${EDGE_PRODUCT_ID}`;
const headers = { Authorization: `ApiKey ${EDGE_API_KEY}`, 'X-ClientID': EDGE_CLIENT_ID };

/** Starts an operation: the API answers 202 with the operation's ID in the Location header */
async function start(url, options) {
  const response = await fetch(url, { method: 'POST', ...options, headers: { ...headers, ...options.headers } });
  if (response.status !== 202) {
    throw new Error(`POST ${url} failed (${response.status}): ${await response.text()}`);
  }
  return response.headers.get('location').split('/').pop();
}

/** Waits for an operation to finish, throwing if it failed */
async function wait(url, step) {
  for (let waited = 0; waited < TIMEOUT_SECONDS; waited += POLL_SECONDS) {
    const operation = await (await fetch(url, { headers })).json();
    if (operation.status === 'Succeeded') {
      return;
    }
    if (operation.status === 'Failed') {
      const details = operation.errors?.map((error) => error.message).join(' ') || '';
      throw new Error(`${step} of ${version} failed (${operation.errorCode}): ${operation.message} ${details}`);
    }
    await new Promise((done) => setTimeout(done, POLL_SECONDS * 1000));
  }
  throw new Error(`${step} of ${version} still in progress after ${TIMEOUT_SECONDS}s`);
}

const upload = await start(`${product}/submissions/draft/package`, {
  headers: { 'Content-Type': 'application/zip' },
  body: readFileSync(resolve(root, 'myga-chrome.zip')),
});
await wait(`${product}/submissions/draft/package/operations/${upload}`, 'Upload');

const publish = await start(`${product}/submissions`, {
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ notes: `Release ${version}: https://github.com/TautvydasDerzinskas/make-youtube-great-again/releases/tag/v${version}` }),
});
await wait(`${product}/submissions/operations/${publish}`, 'Submission');

console.log(`Edge Add-ons: ${version} uploaded and submitted for review`);
