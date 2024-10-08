import { z } from "zod";

export const apiKeySchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  lastUsedAt: z.date().nullable(),
  label: z.string().nullable(),
  hashedKey: z.string(),
  apiKey: z.string().optional(),
});

export type ApiKey = z.infer<typeof apiKeySchema>;

export const ApiKeyCreateInput = z.object({
  label: z.string(),
});

export type ApiKeyCreateInput = z.infer<typeof ApiKeyCreateInput>;
