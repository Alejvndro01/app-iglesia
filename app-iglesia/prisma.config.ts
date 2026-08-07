// prisma.config.ts
import { defineConfig } from "@prisma/config";
import "dotenv/config"; // Prisma CLI usará este dotenv en local

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});