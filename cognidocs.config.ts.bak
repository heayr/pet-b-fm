import { defineConfig } from "cognidocs/config";

export default defineConfig({
  projectName: "balakovo-fm",
  projectDescription:
    "Фриланс-платформа с админкой, авторизацией (NextAuth v5 + 2FA) и управлением контентом на Next.js 15",

  entryPaths: [
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "lib/**/*.{ts,tsx}",
    "types/**/*.{ts}",
  ],

  exclude: [
    "node_modules/**",
    ".next/**",
    "out/**",
    "docs-dist/**",
    "**/*.test.{ts,tsx}",
    "**/*.spec.{ts,tsx}",
  ],

  outDir: "docs-dist",

  themes: {
    sidebar: "grouped",
    syntax: "github-dark",
  },

  diagrams: {
    componentDependencyGraph: true,
    dataFlow: true,
  },

  rsc: {
    detectClientDirectives: true,
    showServerActions: true,
  },

  turbopack: {
    devTurbo: true,
  },
});