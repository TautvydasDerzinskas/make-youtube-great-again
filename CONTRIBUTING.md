# Contributing
Everyone is welcome to contribute to the project or use the code for their own projects.

## Development
Requirements: Node.js 24 (see `.nvmrc`).

1. Run `npm install` to install dependencies (this also sets up the git hooks)
2. Run `npm run dev` (Chrome) or `npm run dev:firefox` to build in watch mode into `dist/<browser>`
3. Load the extension:
   - **Chrome**: open `chrome://extensions`, enable developer mode and "Load unpacked" the `dist/chrome` folder
   - **Firefox**: open `about:debugging#/runtime/this-firefox` and "Load Temporary Add-on…" selecting `dist/firefox/manifest.json`

| Script | Description |
| --- | --- |
| `npm run build` | Production build for both browsers (`dist/chrome`, `dist/firefox`) |
| `npm run build:chrome` / `npm run build:firefox` | Production build for a single browser |
| `npm run zip` | Package the builds into `myga-chrome.zip` & `myga-firefox.zip` |
| `npm run lint` | Lint with [oxlint](https://oxc.rs/docs/guide/usage/linter) |
| `npm run typecheck` | Type check with TypeScript |
| `npm run commit` | Write a conventional commit message interactively |

## Build instructions for add-on reviewers
The extension is written in TypeScript and bundled with [Rspack](https://rspack.rs). To reproduce the submitted Firefox build from source:

```sh
npm ci
npm run build:firefox
```

The output is written to `dist/firefox`.

## Commits & releases
Commit messages follow [Conventional Commits](https://www.conventionalcommits.org), checked by commitlint (`npm run commit` helps writing them). Every push to `main` releases a new version: `feat:` → minor, `feat!:` / `BREAKING CHANGE:` → major, any other type → patch.

Commits scoped to the website (`site/`), like `feat(web): add FAQ`, don't release a new extension version: they only redeploy the website.
