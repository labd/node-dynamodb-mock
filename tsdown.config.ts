import { defineConfig } from "tsdown/config";

export default defineConfig({
	entry: ["src/index.ts"],
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
