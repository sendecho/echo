import { createSafeActionClient, DEFAULT_SERVER_ERROR_MESSAGE } from "next-safe-action";
import { z } from "zod";
import { createClient } from "./supabase/server";
import { getUser } from "./supabase/queries/user.cached";


export const actionClient = createSafeActionClient({
  handleReturnedServerError: (e) => {
    if (e instanceof Error) {
      return e.message;
    }

    return DEFAULT_SERVER_ERROR_MESSAGE;
  }
});

export const actionClientWithMetadata = createSafeActionClient({
  handleReturnedServerError: (e) => {
    if (e instanceof Error) {
      return e.message;
    }

    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
  defineMetadataSchema() {
    return z.object({
      name: z.string(),
      track: z.object({
        event: z.string(),
        name: z.string(),
      }).optional(),
    });
  },
});

export const authSafeAction = actionClientWithMetadata.use(async ({ next, clientInput, metadata }) => {
  const result = await next({ ctx: null });

  if (process.env.NODE_ENV === "development") {
    console.log("Input ->", clientInput);
    console.log("Result ->", result.data);
    console.log("Metadata ->", metadata);

    return result;
  }

  return result;
}).use(async ({ next, metadata }) => {
  const user = await getUser();
  const supabase = createClient();

  if (!user?.data) {
    throw new Error("Unauthorized");
  }

  // if (metadata) {
  //   const analytics = await setupAnalytics({
  //     userId: user.data.id,
  //     fullName: user.data.full_name,
  //   });

  //   if (metadata.track) {
  //     analytics.track(metadata.track);
  //   }
  // }

  // return Sentry.withServerActionInstrumentation(metadata.name, async () => {
  //   return next({
  //     ctx: {
  //       supabase,
  //       user: user.data,
  //     },
  //   });
  // });


  return next({
    ctx: {
      supabase,
      user: user.data,
    },
  });
});;