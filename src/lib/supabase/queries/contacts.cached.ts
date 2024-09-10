import "server-only";

import { unstable_cache } from "next/cache";
import { getSession, getUser } from "./user.cached";
import { fetchContacts } from "./contacts";
import { createClient } from "../server";

export const getContacts = async () => {
  const supabase = createClient();
  const user = await getUser();

  const accountId = user?.data?.account_id;

  if (!accountId) {
    return null;
  }

  return unstable_cache(
    async () => {
      return fetchContacts(supabase, accountId);
    },
    ["contacts", accountId],
    {
      tags: [`contacts_${accountId}`],
      revalidate: 180,
    },
  )();
};