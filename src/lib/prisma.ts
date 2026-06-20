import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

// Read the connection from the environment so it works across machines and
// in production. Falls back to a local SQLite file for development.
// - Local dev:   DATABASE_URL="file:./prisma/dev.db"
// - Turso (prod): DATABASE_URL="libsql://...".  DATABASE_AUTH_TOKEN="..."
const url = process.env.DATABASE_URL || "file:./prisma/dev.db";
const authToken = process.env.DATABASE_AUTH_TOKEN;

// In Prisma 7, pass config directly to the adapter constructor.
const adapter = new PrismaLibSql(authToken ? { url, authToken } : { url });

// Reuse a single client across hot reloads / serverless invocations.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
