# Repository Instructions

This repository publishes `kics-config-nick2bad4u`. Treat `kics.yaml`, every file under `configs/`, and the typed preset-path API as public package surfaces.

## Priorities

- Keep platform auto-detection and normal `.gitignore` handling enabled.
- Never add consumer query, result, or path suppressions to shared policy.
- Preserve secrets scanning and explicit failure behavior.
- Prefer the official versioned KICS container for real integration tests.
- This package supplies configuration only; it must not claim to install KICS.

## Commands

```sh
npm run build:runtime
npm run typecheck
npm test
npm run release:verify
```
