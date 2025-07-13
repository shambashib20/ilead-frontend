// src/env.ts
import { z } from "zod";

// Step 1: Define schema for your environment variables
const envSchema = z.object({
  VITE_API_URL: z.string().url({
    message: "VITE_API_URL must be a valid URL",
  }),
  VITE_STRIPE_KEY: z.string().min(1, {
    message: "VITE_STRIPE_KEY is required",
  }),
  // Add more as needed
});

// Step 2: Parse the env using Zod
const parsedEnv = envSchema.safeParse(import.meta.env);

if (!parsedEnv.success) {
  console.error(
    "%c❌ Invalid environment variables:",
    "color: red; font-weight: bold;",
    parsedEnv.error.flatten().fieldErrors
  );
  throw new Error("❌ Failed to parse env. Check .env files.");
}

// Step 3: Export the validated env with full type safety
export const env = parsedEnv.data;
