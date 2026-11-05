# kiro-web

The public KIRO website (8 pages), the KIRO LUX shop (/lux/) and the Netlify site kiro-pos.netlify.app.

Part of KIRO (Kitchen Intelligence & Restaurant Operations). Owner: @kirotick. Migrated with full history from `kirotick/KIRO_POS` (commit `252de09`), see kiro-documentation/governance/REPOSITORY_MIGRATION_PLAN.md.

## What this repository owns
- Website pages built from the Claude Design canvas (`tools/build-design-site.mjs`, `web/site/`)
- KIRO LUX shop (`web/site/lux/`)
- Netlify configuration: headers, redirects, build (`netlify.toml`)
- Website icons and share images

Nothing here may be copied into another KIRO repository; other repositories use it by version or through its API.

## Depends on
- **kiro-pos** at the tag in `pos-version.txt`: downloaded into `web/site/app/` by `tools/fetch-pos.mjs` during the Netlify build
- **kiro-qa-testing**: browser test suite run on every pull request

## Build
No build for the pages themselves (plain HTML). Netlify runs `node tools/fetch-pos.mjs` and publishes `web/site`.
Rebuild the pages after a canvas change: `node tools/build-design-site.mjs <folder with the canvas .dc.html files>`.

## Test
Put kiro-pos and kiro-qa-testing next to this folder, then in kiro-qa-testing: `npm ci && npx playwright install chromium && npm run qa:e2e`.

## Branches, reviews and releases
`main` is production and protected: changes arrive only by pull request with passing checks (see CONTRIBUTING.md). Versions follow semantic versioning; every release is a git tag `vMAJOR.MINOR.PATCH` with notes in CHANGELOG.md, so each deployment maps to one exact commit. Rollback = redeploy the previous tag.

## Security
See SECURITY.md. Never commit secrets: `.env` files are ignored, and secret scanning with push protection plus gitleaks in CI block them.
