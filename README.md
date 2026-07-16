# kics-config-nick2bad4u

[![CI](https://github.com/Nick2bad4u/kics-config-nick2bad4u/actions/workflows/ci.yml/badge.svg)](https://github.com/Nick2bad4u/kics-config-nick2bad4u/actions/workflows/ci.yml) [![npm](https://img.shields.io/npm/v/kics-config-nick2bad4u.svg)](https://www.npmjs.com/package/kics-config-nick2bad4u)

Portable shared [KICS](https://docs.kics.io/latest/) policies for infrastructure-as-code security scanning. The npm package supplies configuration files and typed path helpers; use the official external KICS container or CLI to scan.

## Install

```sh
npm install --save-dev kics-config-nick2bad4u
```

KICS recommends its container distribution:

```sh
docker run --rm -v "$PWD:/path" checkmarx/kics:v2.1.20 scan \
  --config /path/node_modules/kics-config-nick2bad4u/kics.yaml \
  -p /path
```

## Presets

| Preset         | Policy                                                |
| -------------- | ----------------------------------------------------- |
| `default`      | Auto-detect platforms; fail critical/high             |
| `strict`       | Fail critical/high/medium/low/info                    |
| `ci`           | JSON and SARIF reports; fail critical/high            |
| `report-only`  | Findings do not block, engine failures do             |
| `experimental` | Opt in to experimental queries with the balanced gate |

The configs intentionally omit `type`, so KICS keeps its analyzer and discovers every supported platform. They also omit `exclude-gitignore`; despite its name, that flag disables normal `.gitignore` exclusions.

```sh
kics scan \
  --config node_modules/kics-config-nick2bad4u/configs/strict.yaml \
  -p .
```

No shared preset contains query IDs, similarity IDs, path exclusions, or disabled secret scanning. Add consumer exceptions locally and justify them against the exact finding.

## Typed path API

```ts
import {
 getKicsConfigPath,
 kicsConfigPaths,
 kicsPresets,
 loadKicsConfig,
} from "kics-config-nick2bad4u";

const ciPath = getKicsConfigPath("ci");
const ciYaml = await loadKicsConfig("ci");
```

The resolver returns an absolute package-owned path and rejects unknown runtime values.

## CI output

The `ci` preset writes JSON and SARIF reports beneath `.kics-results/` in the consumer working directory. Add that generated directory to the consumer's ignore rules.

## Development

```sh
npm install
npm run release:verify
```

Tests parse each policy, protect auto-detection and `.gitignore` semantics, prohibit shared suppressions, verify runtime path failures and packed assets, and use a local KICS CLI when available.
