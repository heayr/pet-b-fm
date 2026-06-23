import { defineConfig } from "dev-onboarder";

export default defineConfig({
  project: {
    name: "balakovo-fm",
    description: "Next.js 15 + Prisma + NextAuth v5 (2FA) CMS/платформа",
    frameworks: ["next.js", "react", "prisma", "next-auth", "tailwindcss"],
    language: "TypeScript",
  },

  output: {
    markdown: "docs/ONBOARDING.md",
    diagrams: {
      architecture: "docs/diagrams/architecture.mmd",
      dataFlow: "docs/diagrams/data-flow.mmd",
      dependencyGraph: "docs/diagrams/dependencies.mmd",
    },
  },

  diagrams: {
    mermaid: true,
    includePackageDeps: true,
  },

  include: [
    "README.md",
    "REFACTORING_PLAN.md",
    "prisma/schema.prisma",
    "middleware.ts",
    "auth.ts",
    "next.config.mjs",
  ],
});