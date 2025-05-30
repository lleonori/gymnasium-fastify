import { defineConfig } from "vitest/config";

export default defineConfig(() => ({
  test: {
    setupFiles: ["./vitest-setup.ts"],
    deps: {
      inline: ["@fastify/autoload"],
    },
    coverage: {
      enabled: true,
      exclude: ["dist/**", "migrations/**", "__test__/**"],
      lines: 90,
      functions: 90,
      branches: 90,
      statements: 90,
      reporter: ["lcov", "text"],
    },
    include: ["__test__/**/*.test.{js,ts}"],
    environment: "node",
    globalSetup: ["./vitest-teardown.ts"],
  },
}));
