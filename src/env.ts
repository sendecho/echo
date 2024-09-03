import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    RESEND_API_KEY: z.string().min(1),
    DISABLE_SIGNUP: z.string().transform((s) => s !== "false" && s !== "0"),
    TEST_EMAIL: z.string().transform((s) => s !== "false" && s !== "0"),
    NODE_ENV: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_SUPABASE_URL: z.string().min(1),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  },
  runtimeEnv: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    DISABLE_SIGNUP: process.env.DISABLE_SIGNUP,
    TEST_EMAIL: process.env.TEST_EMAIL,
    NODE_ENV: process.env.NODE_ENV,
  },
});