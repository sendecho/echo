import { env } from "@/env";

// This is the domain of the app without the protocol (e.g. "sendecho.co")
export const APP_DOMAIN = env.NEXT_PUBLIC_ROOT_DOMAIN;

// This is the domain of the app with the protocol (e.g. "https://sendecho.co")
export const APP_URL = `https://${APP_DOMAIN}`;

export const TRACKING_URL = `https://t.${APP_DOMAIN}`;

export const APP_HOSTNAMES = new Set([
  "sendecho.co",
  "localhost:3000",
]);

// Tracking URLs are used to track email opens and clicks
export const TRACKING_HOSTNAMES = new Set([
  "t.sendecho.co",
  "t.localhost:3000",
]);

