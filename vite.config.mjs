import { config } from "dotenv";
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  test: {
    env: {
      ...config({ path: ".env.test" }).parsed,
    },
  },
  plugins: [tsconfigPaths()],
});
