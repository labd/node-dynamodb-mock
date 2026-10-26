import { defineConfig } from "tsdown/config";

export default defineConfig({
	entry: ["src/index.ts"],
	publint: true,
	failOnWarn: true,
	// TypeScript 7 is used on purpose; its "experimental API" notice is not actionable
	suppressWarnings: ["TypeScript 7.0 does not yet have a stable API"],
	clean: true,
	dts: true,
	shims: true,
	deps: {
		alwaysBundle: ["dynalite"],
	},
	hash: false,
	sourcemap: true,
	format: ["esm"],
	outDir: "dist",
});
