import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: ["./resources/js/test/setupTests.ts"],
        include: ["resources/js/**/*.{test,spec}.{js,jsx,ts,tsx}"],
        coverage: {
            provider: "v8",
            reporter: ["text", "json", "html"],
        },
    },
    resolve: {
        alias: {
            "@": "/resources/js",
        },
    },
});
