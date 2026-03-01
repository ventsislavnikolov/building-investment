import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const config = defineConfig({
	plugins: [
		tsconfigPaths({ projects: ["./tsconfig.json"] }),
		tailwindcss(),
		tanstackStart({
			router: {
				routeFileIgnorePattern: "^api$",
			},
		}),
		viteReact(),
	],
	resolve: {
		alias: {
			"~": path.resolve(__dirname, "./src"),
		},
	},
});

export default config;
