import { defineConfig } from "tsup";

export default defineConfig([
	{
		// See https://github.com/egoist/tsup/discussions/505
		banner: {
			js: `import {createRequire as __createRequire} from 'node:module';const require=__createRequire(import\.meta.url);`,
		},
		entry: ["src/index.ts"],
		clean: true,
		splitting: false,
		dts: true,
		noExternal: ["dynalite"],
		sourcemap: true,
		format: ["cjs", "esm", "iife"],
		outDir: "dist",
	},
]);
