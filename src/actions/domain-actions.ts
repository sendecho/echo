"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type DomainVerificationStatus = 'unverified' | 'pending' | 'verified' | 'failed';

export async function setDomainVerificationStatus(
  accountId: string,
  status: DomainVerificationStatus,
  domainId?: string,
  domain?: string
) {
  const supabase = createClient();

  const { error } = await supabase
    .from('accounts')
    .update({
      domain_verification_status: status,
      resend_domain_id: domainId,
      domain: domain
    })
    .eq('id', accountId)
    .throwOnError();

  if (error) throw error;

  revalidatePath('/dashboard');
}

export async function getDomainVerificationStatus(accountId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('accounts')
    .select('domain_verification_status, resend_domain_id, domain')
    .eq('id', accountId)
    .single();

  if (error) throw error;

  return data;
} 