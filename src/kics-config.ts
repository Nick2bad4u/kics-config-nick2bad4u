import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

/** Supported KICS policy presets. */
export type KicsPreset =
    | "ci"
    | "default"
    | "experimental"
    | "report-only"
    | "strict";

/** All bundled KICS policy preset names. */
export const kicsPresets: readonly KicsPreset[] = Object.freeze([
    "default",
    "strict",
    "ci",
    "report-only",
    "experimental",
]);

const paths: Readonly<Record<KicsPreset, string>> = Object.freeze({
    ci: fileURLToPath(new URL("../configs/ci.yaml", import.meta.url)),
    default: fileURLToPath(new URL("../kics.yaml", import.meta.url)),
    experimental: fileURLToPath(
        new URL("../configs/experimental.yaml", import.meta.url)
    ),
    "report-only": fileURLToPath(
        new URL("../configs/report-only.yaml", import.meta.url)
    ),
    strict: fileURLToPath(new URL("../configs/strict.yaml", import.meta.url)),
});

/** Absolute path to the default `kics.yaml`. */
export const kicsConfigPath: string = paths.default;

/** Immutable mapping from preset names to package-owned absolute paths. */
export const kicsConfigPaths: Readonly<Record<KicsPreset, string>> = paths;

/**
 * Resolve one bundled KICS config to an absolute filesystem path.
 *
 * @throws RangeError if `preset` is not a bundled preset name.
 */
export function getKicsConfigPath(preset: KicsPreset = "default"): string {
    switch (preset) {
        case "ci":
        case "default":
        case "experimental":
        case "report-only":
        case "strict": {
            return paths[preset];
        }
        default: {
            throw new RangeError(
                "Unknown KICS preset. Expected one of: default, strict, ci, report-only, experimental."
            );
        }
    }
}

/** Load one bundled KICS config as YAML text. */
export async function loadKicsConfig(
    preset: KicsPreset = "default"
): Promise<string> {
    // eslint-disable-next-line security/detect-non-literal-fs-filename -- The resolver returns only package-owned preset paths.
    return readFile(getKicsConfigPath(preset), "utf8");
}

export default kicsConfigPath;
