import { createClient } from "@/lib/supabase/server";
import { getDomainData } from "@/lib/resend";
import { setDomainVerificationStatus } from "@/actions/domain-actions";

export const runtime = 'edge';

export async function GET(request: Request) {
  // Verify the request is from your cron service (e.g., Vercel Cron)
  const authHeader = request.headers.get('Authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET_KEY}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const supabase = createClient();

  // Get all pending domains
  const { data: pendingWorkspaces, error } = await supabase
    .from('workspaces')
    .select('id, domain_id, domain_name')
    .eq('domain_verification_status', 'pending');

  if (error) {
    return new Response('Database error', { status: 500 });
  }

  // Check each pending domain
  for (const workspace of pendingWorkspaces) {
    if (!workspace.domain_name) continue;

    const domainData = await getDomainData(workspace.domain_name);

    if (!domainData) {
      await setDomainVerificationStatus(
        workspace.id,
        'failed'
      );
      continue;
    }

    await setDomainVerificationStatus(
      workspace.id,
      domainData.status === 'verified' ? 'verified' : 'pending'
    );
  }

  return new Response('OK', { status: 200 });
} 