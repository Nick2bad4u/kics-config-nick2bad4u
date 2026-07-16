import { spawnSync } from "node:child_process";
import { access } from "node:fs/promises";
import * as path from "node:path";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";

import {
    getKicsConfigPath,
    kicsConfigPath,
    kicsConfigPaths,
    type KicsPreset,
    kicsPresets,
    loadKicsConfig,
} from "../src/kics-config.js";

describe("kICS shared policy", () => {
    it.each(kicsPresets)("loads the %s preset", async (preset) => {
        expect.assertions(5);

        const configPath = getKicsConfigPath(preset);
        const source = await loadKicsConfig(preset);
        const config = parse(source) as Record<string, unknown>;

        await access(configPath);

        expect(path.isAbsolute(configPath)).toBe(true);
        expect(configPath).toBe(kicsConfigPaths[preset]);
        expect(source.endsWith("\n")).toBe(true);
        expect(config["disable-secrets"]).toBe(false);
        expect(config["ignore-on-exit"]).toBeTypeOf("string");
    });

    it("keeps the default path conventional", () => {
        expect.assertions(2);

        expect(kicsConfigPath).toBe(getKicsConfigPath("default"));
        expect(path.basename(kicsConfigPath)).toBe("kics.yaml");
    });

    it("rejects unknown presets at runtime", () => {
        expect.assertions(1);

        expect(() => getKicsConfigPath("invented" as KicsPreset)).toThrow(
            RangeError
        );
    });

    it("keeps auto-detection, gitignore, and consumer suppressions intact", async () => {
        expect.hasAssertions();

        for (const preset of kicsPresets) {
            const config = parse(await loadKicsConfig(preset)) as Record<
                string,
                unknown
            >;

            expect(config).not.toHaveProperty("type");
            expect(config).not.toHaveProperty("exclude-gitignore");
            expect(config).not.toHaveProperty("exclude-paths");
            expect(config).not.toHaveProperty("exclude-queries");
            expect(config).not.toHaveProperty("exclude-results");
        }
    });

    it.runIf(spawnSync("kics", ["version"]).status === 0)(
        "accepts every preset with the real KICS CLI",
        () => {
            expect.hasAssertions();

            for (const preset of kicsPresets) {
                const result = spawnSync(
                    "kics",
                    [
                        "scan",
                        "--config",
                        getKicsConfigPath(preset),
                        "--help",
                    ],
                    { encoding: "utf8" }
                );

                expect(result.status).toBe(0);
            }
        }
    );
});
