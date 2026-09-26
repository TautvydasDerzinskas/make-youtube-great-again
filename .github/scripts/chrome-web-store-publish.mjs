/**
 * Uploads myga-chrome.zip to the Chrome Web Store and submits it for review, published automatically
 * once approved. Uses the Chrome Web Store API v2 with a service account (v1.1 stops working on
 * October 15, 2026).
 *
 * The store takes no new package while a previous one is in review, so the version is then skipped
 * with a warning: the next release uploads its own, newer version.
 *
 * Usage: node .github/scripts/chrome-web-store-publish.mjs <version>
 * Env: CWS_SERVICE_ACCOUNT_KEY (the service account's JSON key), CWS_PUBLISHER_ID
 */
import { createSign } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const EXTENSION_ID = 'geonnhfmhfjfkbbkjmbanmjommkjlnim';
const API = 'https://chromewebstore.googleapis.com';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SCOPE = 'https://www.googleapis.com/auth/chromewebstore';
const UPLOAD_TIMEOUT_SECONDS = 120;

const version = process.argv[2];
if (!/^\d+\.\d+\.\d+$/.test(version || '')) {
  console.error('Usage: node .github/scripts/chrome-web-store-publish.mjs <version>');
  process.exit(1);
}

const { CWS_SERVICE_ACCOUNT_KEY, CWS_PUBLISHER_ID } = process.env;
if (!CWS_SERVICE_ACCOUNT_KEY || !CWS_PUBLISHER_ID) {
  console.error('CWS_SERVICE_ACCOUNT_KEY and CWS_PUBLISHER_ID must be set to publish to the Chrome Web Store');
  process.exit(1);
}

const root = resolve(import.meta.dirname, '../..');
const item = `${API}/v2/publishers/${CWS_PUBLISHER_ID}/items/${EXTENSION_ID}`;
const base64url = (value) => Buffer.from(value).toString('base64url');

/** Signs a JWT with the service account's key and exchanges it for an access token */
async function fetchToken() {
  const { client_email: email, private_key: key } = JSON.parse(CWS_SERVICE_ACCOUNT_KEY);
  const now = Math.floor(Date.now() / 1000);
  const unsigned = [
    base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' })),
    base64url(JSON.stringify({ iss: email, scope: SCOPE, aud: TOKEN_URL, iat: now, exp: now + 3600 })),
  ].join('.');
  const signature = createSign('RSA-SHA256').update(unsigned).sign(key, 'base64url');

  const { access_token: token } = await call(TOKEN_URL, {
    method: 'POST',
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${unsigned}.${signature}`,
    }),
  });
  return token;
}

async function call(url, options) {
  const response = await fetch(url, options);
  const body = await response.json();
  if (!response.ok) {
    throw new Error(`${options.method} ${url} failed (${response.status}): ${JSON.stringify(body.error ?? body)}`);
  }
  return body;
}

const token = await fetchToken();
const headers = { Authorization: `Bearer ${token}` };

const status = await call(`${item}:fetchStatus`, { method: 'GET', headers });
const submitted = status.submittedItemRevisionStatus;
if (submitted?.state === 'PENDING_REVIEW') {
  const inReview = submitted.distributionChannels?.[0]?.crxVersion ?? 'A previous version';
  console.log(`::warning::${inReview} is still in review on the Chrome Web Store, ${version} was not uploaded`);
  process.exit(0);
}

let upload = await call(`${API}/upload/v2/publishers/${CWS_PUBLISHER_ID}/items/${EXTENSION_ID}:upload`, {
  method: 'POST',
  headers: { ...headers, 'X-Goog-Upload-Protocol': 'raw', 'X-Goog-Upload-File-Name': 'myga-chrome.zip' },
  body: readFileSync(resolve(root, 'myga-chrome.zip')),
});

// Large packages are processed asynchronously
for (let waited = 0; upload.uploadState === 'IN_PROGRESS' && waited < UPLOAD_TIMEOUT_SECONDS; waited += 5) {
  await new Promise((done) => setTimeout(done, 5000));
  const { lastAsyncUploadState } = await call(`${item}:fetchStatus`, { method: 'GET', headers });
  upload = { ...upload, uploadState: lastAsyncUploadState };
}
if (upload.uploadState !== 'SUCCEEDED') {
  throw new Error(`Upload of ${version} ended as ${upload.uploadState}`);
}

const published = await call(`${item}:publish`, {
  method: 'POST',
  headers: { ...headers, 'Content-Type': 'application/json' },
  body: JSON.stringify({ publishType: 'DEFAULT_PUBLISH' }),
});
console.log(`Chrome Web Store: ${version} uploaded and submitted (${published.state})`);
